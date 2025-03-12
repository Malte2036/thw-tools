#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../../.env' });

async function main() {
  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  const OUTPUT_SQL_FILE = 'migration_output.sql';

  let mongoClient = null;

  try {
    // 1) Connect to MongoDB
    mongoClient = await MongoClient.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoClient.db();

    // 2) Load old collections
    const oldUsers = await db.collection('users').find({}).toArray();
    const oldOrgs = await db.collection('organisations').find({}).toArray();
    const oldFunkItems = await db.collection('funkitems').find({}).toArray();
    const oldFunkItemEvents = await db
      .collection('funkitemevents')
      .find({})
      .toArray();
    const oldFunkItemEventBulks = await db
      .collection('funkitemeventbulks')
      .find({})
      .toArray();
    const oldInventory = await db
      .collection('inventoryitems')
      .find({})
      .toArray();

    console.table({
      oldUsers: oldUsers.length,
      oldOrgs: oldOrgs.length,
      oldFunkItems: oldFunkItems.length,
      oldFunkItemEvents: oldFunkItemEvents.length,
      oldFunkItemEventBulks: oldFunkItemEventBulks.length,
      oldInventory: oldInventory.length,
    });

    // 3) Create ID Maps (Mongo _id => new UUID)
    const userIdMap = new Map();
    const orgIdMap = new Map();
    const funkItemIdMap = new Map();
    const funkItemEventIdMap = new Map();
    const funkItemEventBulkIdMap = new Map();
    const inventoryIdMap = new Map();

    // We'll store all generated SQL statements here
    let sqlStatements = [];

    // Add initial comment
    sqlStatements.push('-- Migration generated on ' + new Date().toISOString());
    sqlStatements.push('BEGIN;');

    // Add at start of migration
    sqlStatements.push(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'inventory') THEN
          RAISE EXCEPTION 'Schema "inventory" does not exist';
        END IF;
      END
      $$;
    `);

    // -------------------------------------------------------------------------
    // USERS
    // -------------------------------------------------------------------------
    console.log('Migrating users...');
    let processed = 0;
    for (const oldUser of oldUsers) {
      const newUserId = uuidv4();
      userIdMap.set(oldUser._id.toString(), newUserId);

      const kindeId = oldUser.kindeId || oldUser._id.toString();
      const email = oldUser.email || null;
      const firstName = oldUser.firstName || '';
      const lastName = oldUser.lastName || '';
      const picture = oldUser.picture || '';

      sqlStatements.push(`
        INSERT INTO inventory.users (
          id, 
          "kindeId", 
          email, 
          "firstName", 
          "lastName", 
          picture
        )
        VALUES (
          '${newUserId}',
          '${escapeSql(kindeId)}',
          '${email ? escapeSql(email) : 'NULL'}',
          '${escapeSql(firstName)}',
          '${escapeSql(lastName)}',
          '${escapeSql(picture)}'
        );
      `);
      processed++;
      if (processed % 100 === 0) {
        logProgress(processed, oldUsers.length, 'users');
      }
    }

    // -------------------------------------------------------------------------
    // ORGANISATIONS
    // -------------------------------------------------------------------------
    console.log('Migrating organisations...');
    for (const oldOrg of oldOrgs) {
      if (!oldOrg.name) {
        console.log(
          `Skipping organisation ${oldOrg._id.toString()} - missing name`,
        );
        continue;
      }
      const newOrgId = uuidv4();
      orgIdMap.set(oldOrg._id.toString(), newOrgId);

      const name = oldOrg.name;
      const inviteCode = oldOrg.inviteCode || '';

      sqlStatements.push(`
        INSERT INTO inventory.organisations (id, name, "inviteCode")
        VALUES ('${newOrgId}', '${escapeSql(name)}', '${escapeSql(inviteCode)}');
      `);
    }

    // -------------------------------------------------------------------------
    // ORGANISATION MEMBERS (JOIN TABLE)
    // -------------------------------------------------------------------------
    console.log('Migrating organisation members...');
    for (const oldOrg of oldOrgs) {
      const newOrgId = orgIdMap.get(oldOrg._id.toString());
      if (!oldOrg.members) continue;

      for (const oldUserId of oldOrg.members) {
        const newUserId = userIdMap.get(oldUserId.toString());
        if (!newUserId) continue;
        sqlStatements.push(`
          INSERT INTO inventory.organisation_members ("organisationId", "userId")
          VALUES ('${newOrgId}', '${newUserId}');
        `);
      }
    }

    // -------------------------------------------------------------------------
    // FUNK ITEMS
    // -------------------------------------------------------------------------
    console.log('Migrating funk items...');
    for (const oldFunk of oldFunkItems) {
      const newFunkId = uuidv4();
      funkItemIdMap.set(oldFunk._id.toString(), newFunkId);

      const deviceId = oldFunk.deviceId || '';
      const oldOrgId = getStringId(oldFunk.organisation);
      const newOrgId = orgIdMap.get(oldOrgId);

      if (!newOrgId) continue;

      sqlStatements.push(`
        INSERT INTO inventory.funk_items (id, "deviceId", "organisationId")
        VALUES ('${newFunkId}', '${escapeSql(deviceId)}', '${newOrgId}');
      `);
    }

    // -------------------------------------------------------------------------
    // FUNK ITEM EVENTS
    // -------------------------------------------------------------------------
    console.log('Migrating funk item events...');
    for (const oldEvent of oldFunkItemEvents) {
      const newEventId = uuidv4();
      funkItemEventIdMap.set(oldEvent._id.toString(), newEventId);

      const oldFunkItemId = oldEvent.funkItem?.toString();
      const newFunkItemId = funkItemIdMap.get(oldFunkItemId);

      const oldUserId = oldEvent.user?.toString();
      const newUserId = userIdMap.get(oldUserId);

      const eventType = oldEvent.type || 'borrowed';
      const eventDate = formatDate(oldEvent.date) || 'NULL';

      if (!newFunkItemId || !newUserId) {
        console.log(
          `Skipping event ${oldEvent._id.toString()} - missing funkItemId or userId`,
        );
        continue;
      }

      sqlStatements.push(`
        INSERT INTO inventory.funk_item_events (
          id,
          "funkItemId",
          "userId",
          type,
          date
        )
        VALUES (
          '${newEventId}',
          '${newFunkItemId}',
          '${newUserId}',
          '${escapeSql(eventType)}',
          ${eventDate}
        );
      `);
    }

    // Create a set to track successfully inserted bulk IDs
    const insertedBulkIds = new Set();

    // -------------------------------------------------------------------------
    // FUNK ITEM EVENT BULKS
    // -------------------------------------------------------------------------
    console.log('Migrating funk item event bulks...');
    for (const oldBulk of oldFunkItemEventBulks) {
      const newBulkId = uuidv4();
      funkItemEventBulkIdMap.set(oldBulk._id.toString(), newBulkId);
      insertedBulkIds.add(newBulkId);

      const oldOrgId = getStringId(oldBulk.organisation);
      const newOrgId = orgIdMap.get(oldOrgId);
      if (!newOrgId) {
        console.log(
          `Warning: Could not find organisation ID mapping for ${oldOrgId}`,
        );
        continue;
      }

      const oldUserId = oldBulk.user?.toString();
      const newUserId = userIdMap.get(oldUserId);

      const eventType = oldBulk.eventType || 'borrowed';
      const batteryCount = oldBulk.batteryCount || 0;
      const bulkDate = oldBulk.date
        ? `'${new Date(oldBulk.date).toISOString()}'`
        : 'CURRENT_TIMESTAMP';

      if (!newUserId || !newOrgId) {
        console.log(
          `Skipping bulk ${oldBulk._id.toString()} - missing userId or organisationId`,
        );
        continue;
      }

      sqlStatements.push(`
        INSERT INTO inventory.funk_item_event_bulks (
          id,
          "eventType",
          "batteryCount",
          "userId",
          "organisationId",
          date
        )
        VALUES (
          '${newBulkId}',
          '${escapeSql(eventType)}',
          ${batteryCount},
          '${newUserId}',
          '${newOrgId}',
          ${bulkDate}
        );
      `);
    }

    // -------------------------------------------------------------------------
    // FUNK ITEM EVENT BULK EVENTS (JOIN TABLE)
    // -------------------------------------------------------------------------
    console.log('Linking funk item events to bulks...');
    for (const oldBulk of oldFunkItemEventBulks) {
      const newBulkId = funkItemEventBulkIdMap.get(oldBulk._id.toString());

      if (!insertedBulkIds.has(newBulkId)) {
        console.log(
          `Skipping bulk ${oldBulk._id.toString()} - bulk was not successfully inserted`,
        );
        continue;
      }

      if (!oldBulk.funkItemEvents || !newBulkId) {
        console.log(
          `Skipping bulk ${oldBulk._id.toString()} - missing funkItemEvents array or bulk not found`,
        );
        continue;
      }

      for (const oldEventId of oldBulk.funkItemEvents) {
        const newEventId = funkItemEventIdMap.get(oldEventId.toString());
        if (!newEventId) {
          console.log(
            `Skipping event ${oldEventId.toString()} - event not found in funkItemEventIdMap`,
          );
          continue;
        }

        sqlStatements.push(`
          INSERT INTO inventory.funk_item_event_bulk_events ("bulkId", "eventId")
          VALUES ('${newBulkId}', '${newEventId}');
        `);
      }
    }

    // -------------------------------------------------------------------------
    // INVENTORY ITEMS
    // -------------------------------------------------------------------------
    console.log('Migrating inventory items...');
    for (const oldInv of oldInventory) {
      const newInvId = uuidv4();
      inventoryIdMap.set(oldInv._id.toString(), newInvId);

      const oldOrgId = oldInv.organisation?.toString();
      const newOrgId = orgIdMap.get(oldOrgId);
      if (!newOrgId) continue;

      // First create custom data if it exists
      let customDataId = null;
      if (oldInv.customData) {
        customDataId = uuidv4();
        const lastScanned = oldInv.customData.lastScanned || null;
        const note = oldInv.customData.note || '';

        sqlStatements.push(`
          INSERT INTO inventory.inventory_item_custom_data (
            id, 
            "lastScanned", 
            note
          )
          VALUES (
            '${customDataId}',
            ${lastScanned ? `'${new Date(lastScanned).toISOString()}'` : 'NULL'},
            '${escapeSql(note)}'
          );
        `);
      }

      sqlStatements.push(`
        INSERT INTO inventory.inventory_items (
          "id",
          "organisationId",
          "einheit",
          "ebene",
          "art",
          "menge",
          "mengeIst",
          "verfuegbar",
          "ausstattung",
          "hersteller",
          "typ",
          "inventarNummer",
          "sachNummer",
          "gerateNummer",
          "status",
          "customDataId"
        )
        VALUES (
          '${newInvId}',
          '${newOrgId}',
          ${escapeSql(oldInv.einheit || '') ? `'${escapeSql(oldInv.einheit || '')}'` : 'NULL'},
          ${oldInv.ebene || 0},
          ${oldInv.art ? `'${escapeSql(oldInv.art)}'` : 'NULL'},
          ${oldInv.menge === null ? 'NULL' : oldInv.menge},
          ${oldInv.mengeIst === null ? 'NULL' : oldInv.mengeIst},
          ${oldInv.verfuegbar === null ? 'NULL' : oldInv.verfuegbar},
          ${escapeSql(oldInv.ausstattung || '') ? `'${escapeSql(oldInv.ausstattung || '')}'` : 'NULL'},
          ${oldInv.hersteller ? `'${escapeSql(oldInv.hersteller)}'` : 'NULL'},
          ${oldInv.typ ? `'${escapeSql(oldInv.typ)}'` : 'NULL'},
          ${oldInv.inventarNummer ? `'${escapeSql(oldInv.inventarNummer)}'` : 'NULL'},
          ${oldInv.sachNummer ? `'${escapeSql(oldInv.sachNummer)}'` : 'NULL'},
          ${oldInv.gerateNummer ? `'${escapeSql(oldInv.gerateNummer)}'` : 'NULL'},
          ${oldInv.status ? `'${escapeSql(oldInv.status)}'` : 'NULL'},
          ${customDataId ? `'${customDataId}'` : 'NULL'}
        );
      `);
    }

    // Add commit
    sqlStatements.push('COMMIT;');

    // 5) Write all statements to file
    fs.writeFileSync(OUTPUT_SQL_FILE, sqlStatements.join('\n'), 'utf8');
    console.log(`Migration SQL written to ${OUTPUT_SQL_FILE}`);
  } catch (error) {
    sqlStatements.push('ROLLBACK;');
    console.error('Migration error:', {
      message: error.message,
      stack: error.stack,
      context: error.context || 'Unknown context',
    });
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

// A simple naive string escape
function escapeSql(str) {
  if (str === null || str === undefined) return null;
  const trimmed = str.toString().trim();
  if (trimmed === '') return null;
  return trimmed
    .replace(/'/g, "''")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\\['"]/g, '') // Remove escaped quotes
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove non-printable characters
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ''); // Keep only printable ASCII and extended Latin-1
}

function formatDate(date) {
  if (!date) return null;
  try {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return null;
    return `'${parsed.toISOString()}'`;
  } catch (e) {
    return null;
  }
}

function getStringId(id) {
  if (!id) return null;
  return typeof id === 'object' ? id.toString() : id;
}

function logProgress(current, total, entity) {
  const percentage = Math.round((current / total) * 100);
  console.log(`Processing ${entity}: ${current}/${total} (${percentage}%)`);
}

main().catch((err) => console.error(err));
