# TODO: Mission & Material Management Feature Implementation Plan

This document provides a detailed, step-by-step guide for an LLM to implement the "Mission & Material Management" feature. Follow each step precisely to ensure a correct and error-free result.

## High-Level Goal

The goal is to build a feature that allows users to:
1.  Create "Missions" (Einsätze).
2.  Track inventoried items for a mission by scanning QR codes.
3.  Manually add non-inventoried items to a mission.
4.  Update the status of each item (e.g., Returned, Lost, Defective).
5.  Complete a mission to finalize the material list.

---

## Stage 1: Database Layer

### Step 1.1: Update the Prisma Schema - FINISHED

**Action:** Modify the file at `apps/backend/prisma/schema.prisma` to include the new models and enums required for this feature. Add the following code to the end of the file.

**File:** `/Users/sehmer/private_git/thw-tools/apps/backend/prisma/schema.prisma`

```prisma
// APPEND THIS CODE TO THE END OF THE FILE

model Mission {
  id             String            @id @default(uuid()) @db.Uuid
  name           String            @db.VarChar(255)
  location       String?           @db.VarChar(255)
  description    String?           @db.VarChar(1000)
  startDate      DateTime          @default(now()) @db.Timestamp(6)
  endDate        DateTime?         @db.Timestamp(6)
  status         MissionStatus     @default(ACTIVE)
  organisationId String            @db.Uuid
  organisation   Organisation      @relation(fields: [organisationId], references: [id])
  materials      MissionMaterial[]
  createdAt      DateTime          @default(now()) @db.Timestamp(6)
  updatedAt      DateTime          @updatedAt @db.Timestamp(6)

  @@map("missions")
  @@schema("inventory")
}

model MissionMaterial {
  id              String         @id @default(uuid()) @db.Uuid
  missionId       String         @db.Uuid
  mission         Mission        @relation(fields: [missionId], references: [id], onDelete: Cascade)
  inventoryItemId String?        @db.Uuid
  inventoryItem   InventoryItem? @relation(fields: [inventoryItemId], references: [id])
  manualName      String?        @db.VarChar(255)
  manualQuantity  Float?         @default(1)
  manualUnit      String?        @db.VarChar(50)
  status          MaterialStatus @default(CHECKED_OUT)
  checkedOutAt    DateTime       @default(now()) @db.Timestamp(6)
  returnedAt      DateTime?      @db.Timestamp(6)
  createdAt       DateTime       @default(now()) @db.Timestamp(6)
  updatedAt       DateTime       @updatedAt @db.Timestamp(6)

  @@map("mission_materials")
  @@schema("inventory")
}

enum MissionStatus {
  ACTIVE
  COMPLETED

  @@map("mission_status")
  @@schema("inventory")
}

enum MaterialStatus {
  CHECKED_OUT
  RETURNED
  LOST
  DEFECTIVE

  @@map("material_status")
  @@schema("inventory")
}
```

### Step 1.2: Generate the Prisma Client - FINISHED

**Action:** Run the following command in the terminal to update the Prisma client with the new models.

**Directory:** `/Users/sehmer/private_git/thw-tools/`
**Command:**
```bash
npx prisma generate
```

**Verification:** The command should complete successfully without errors.

### Step 1.3: Create and Apply the Database Migration - FINISHED

**Action:** Run the following command to create a new SQL migration file and apply it to the development database.

**Directory:** `/Users/sehmer/private_git/thw-tools/`
**Command:**
```bash
npx prisma migrate dev --name add_missions_feature
```

**Verification:** The command should report that the migration was generated and applied successfully.

---

## Stage 2: Backend API Layer (NestJS)

### Step 2.1: Scaffold the `missions` Module - FINISHED

**Action:** Use the `nx` and NestJS CLI schematics to generate the boilerplate for the new `missions` resource.

**Directory:** `/Users/sehmer/private_git/thw-tools/`
**Command:**
```bash
npx nx g @nestjs/schematics:resource missions --project=backend
```
*When prompted, select `REST API`.*

### Step 2.2: Define Data Transfer Objects (DTOs) - FINISHED

**Action:** Create and populate the DTO files that will define the shape of data for API requests.

**File 1:** `/Users/sehmer/private_git/thw-tools/apps/backend/src/missions/dto/create-mission.dto.ts`
**Content:**
```typescript
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;
}
```

**File 2:** `/Users/sehmer/private_git/thw-tools/apps/backend/src/missions/dto/scan-material.dto.ts`
**Content:**
```typescript
import { IsUUID } from 'class-validator';

export class ScanMaterialDto {
  @IsUUID()
  inventoryItemId: string;
}
```

**File 3:** `/Users/sehmer/private_git/thw-tools/apps/backend/src/missions/dto/create-manual-material.dto.ts`
**Content:**
```typescript
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateManualMaterialDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @IsOptional()
  unit?: string;
}
```

**File 4:** `/Users/sehmer/private_git/thw-tools/apps/backend/src/missions/dto/update-material-status.dto.ts`
**Content:**
```typescript
import { IsEnum } from 'class-validator';
import { MaterialStatus } from '@prisma/client/inventory';

export class UpdateMaterialStatusDto {
  @IsEnum(MaterialStatus)
  status: MaterialStatus;
}
```

### Step 2.3: Implement the `MissionsService` - FINISHED

**Action:** Replace the entire content of the generated service file with the logic below. This service will handle all business logic related to missions.

**File:** `/Users/sehmer/private_git/thw-tools/apps/backend/src/missions/missions.service.ts`
**Content:**
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { ScanMaterialDto } from './dto/scan-material.dto';
import { CreateManualMaterialDto } from './dto/create-manual-material.dto';
import { UpdateMaterialStatusDto } from './dto/update-material-status.dto';
import { MaterialStatus } from '@prisma/client/inventory';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async create(organisationId: string, createMissionDto: CreateMissionDto) {
    return this.prisma.mission.create({
      data: {
        ...createMissionDto,
        organisationId,
      },
    });
  }

  async findAllForOrg(organisationId: string) {
    return this.prisma.mission.findMany({
      where: { organisationId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string, organisationId: string) {
    const mission = await this.prisma.mission.findFirst({
      where: { id, organisationId },
      include: {
        materials: {
          include: {
            inventoryItem: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found.`);
    }
    return mission;
  }

  async scanMaterial(missionId: string, scanMaterialDto: ScanMaterialDto) {
    const { inventoryItemId } = scanMaterialDto;

    const existingMaterial = await this.prisma.missionMaterial.findFirst({
      where: {
        missionId,
        inventoryItemId,
        status: MaterialStatus.CHECKED_OUT,
      },
    });

    if (existingMaterial) {
      return { actionRequired: true, missionMaterialId: existingMaterial.id };
    }

    return this.prisma.missionMaterial.create({
      data: {
        missionId,
        inventoryItemId,
        status: MaterialStatus.CHECKED_OUT,
      },
      include: { inventoryItem: true },
    });
  }

  async createManualMaterial(
    missionId: string,
    createManualDto: CreateManualMaterialDto,
  ) {
    return this.prisma.missionMaterial.create({
      data: {
        missionId,
        manualName: createManualDto.name,
        manualQuantity: createManualDto.quantity,
        manualUnit: createManualDto.unit,
        status: MaterialStatus.CHECKED_OUT,
      },
    });
  }

  async updateMaterialStatus(
    materialId: string,
    updateDto: UpdateMaterialStatusDto,
  ) {
    const data: { status: MaterialStatus; returnedAt?: Date } = {
      status: updateDto.status,
    };

    if (
      updateDto.status === MaterialStatus.RETURNED ||
      updateDto.status === MaterialStatus.LOST ||
      updateDto.status === MaterialStatus.DEFECTIVE
    ) {
      data.returnedAt = new Date();
    }

    return this.prisma.missionMaterial.update({
      where: { id: materialId },
      data,
    });
  }

  async complete(id: string) {
    return this.prisma.mission.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endDate: new Date(),
      },
    });
  }
}
```

### Step 2.4: Implement the `MissionsController` - FINISHED

**Action:** Replace the entire content of the generated controller file. This will define the API routes and connect them to the service. *Note: This assumes you have a `JwtAuthGuard` and a way to get the current user and their organisation from the request. Adjust the `user` and `organisationId` logic if your implementation differs.*

**File:** `/Users/sehmer/private_git/thw-tools/apps/backend/src/missions/missions.controller.ts`
**Content:**
```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { ScanMaterialDto } from './dto/scan-material.dto';
import { CreateManualMaterialDto } from './dto/create-manual-material.dto';
import { UpdateMaterialStatusDto } from './dto/update-material-status.dto';
// Assuming you have a JWT guard. If not, this line should be adapted or removed.
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Protect all routes in this controller
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  // This is a placeholder for getting the user's org ID.
  // Replace with your actual implementation.
  private getOrgIdFromRequest(req): string {
    // Example: return req.user.organisationId;
    // For now, this will need to be replaced with a real org ID for testing.
    // This is a critical part to adapt to your existing auth structure.
    if (req.user && req.user.organisations && req.user.organisations[0]) {
      return req.user.organisations[0].organisationId;
    }
    throw new Error('Could not determine organisation from request.');
  }

  @Post()
  create(@Req() req, @Body() createMissionDto: CreateMissionDto) {
    const organisationId = this.getOrgIdFromRequest(req);
    return this.missionsService.create(organisationId, createMissionDto);
  }

  @Get()
  findAll(@Req() req) {
    const organisationId = this.getOrgIdFromRequest(req);
    return this.missionsService.findAllForOrg(organisationId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    const organisationId = this.getOrgIdFromRequest(req);
    return this.missionsService.findOne(id, organisationId);
  }

  @Post(':id/scan')
  scanMaterial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() scanMaterialDto: ScanMaterialDto,
  ) {
    return this.missionsService.scanMaterial(id, scanMaterialDto);
  }

  @Post(':id/manual-materials')
  createManualMaterial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createManualDto: CreateManualMaterialDto,
  ) {
    return this.missionsService.createManualMaterial(id, createManualDto);
  }

  @Patch(':missionId/materials/:materialId')
  updateMaterialStatus(
    @Param('materialId', ParseUUIDPipe) materialId: string,
    @Body() updateDto: UpdateMaterialStatusDto,
  ) {
    return this.missionsService.updateMaterialStatus(materialId, updateDto);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.missionsService.complete(id);
  }
}
```

### Step 2.5: Update the `AppModule` - FINISHED

**Action:** Add the new `MissionsModule` to the `imports` array in your main application module to register it with NestJS.

**File:** `/Users/sehmer/private_git/thw-tools/apps/backend/src/app.module.ts`
**Instruction:** Find the `@Module` decorator and add `MissionsModule` to the `imports` array.

```typescript
// ... other imports
import { MissionsModule } from './missions/missions.module';

@Module({
  imports: [
    // ... other modules
    MissionsModule, // <-- ADD THIS LINE
  ],
  // ... controllers, providers
})
export class AppModule {}
```

**Verification:** The backend application should now be able to start without errors. You can run your start command (e.g., `npm run start apps/backend`) to confirm.

---

## Stage 3: Frontend UI Layer (SvelteKit)

## Stage 3: Frontend UI Layer (SvelteKit)

This stage involves building the user interface in the `inventar` SvelteKit application.

### Step 3.1: Create the API Service - FINISHED

**Action:** Create a new file to handle all communication with the backend API.

**File:** `/Users/sehmer/private_git/thw-tools/apps/inventar/src/lib/services/missions.service.ts`
**Content:**
```typescript
// This will be a placeholder for the actual service implementation.
// The full content will be added in a subsequent step.
export const missionsService = {
  // Functions to get missions, create missions, scan items, etc. will go here.
};
```

### Step 3.2: Add Navigation Link - FINISHED

**Action:** Find the main layout or header component and add a navigation link to `/missions`.

### Step 3.3: Create Mission List Page - FINISHED

**Action:** Create the Svelte route to display a list of all missions.

**File:** `/Users/sehmer/private_git/thw-tools/apps/inventar/src/routes/missions/+page.svelte`
**Content:**
```svelte
<!-- Placeholder for the mission list page -->
<h1>Missions</h1>
<a href="/missions/new">Create New Mission</a>
<!-- Logic to fetch and display missions will be added here -->
```

### Step 3.4: Create "New Mission" Page - FINISHED

**Action:** Create the Svelte route with a form to create a new mission.

**File:** `/Users/sehmer/private_git/thw-tools/apps/inventar/src/routes/missions/new/+page.svelte`
**Content:**
```svelte
<!-- Placeholder for the new mission form -->
<h1>Create New Mission</h1>
<form>
  <!-- Form inputs for name, location, etc. will be added here -->
  <button type="submit">Create</button>
</form>
```

### Step 3.5: Create Mission Detail Page and Components - FINISHED

**Action:** Create the main detail page and the modal components it requires.

**File 1:** `/Users/sehmer/private_git/thw-tools/apps/inventar/src/routes/missions/[id]/+page.svelte`
**Content:**
```svelte
<!-- Placeholder for the mission detail page -->
<h1>Mission Details</h1>
<button>Scan Item</button>
<button>Add Manually</button>
<!-- Logic to display mission details and the material list will be added here -->
```

**File 2:** `/Users/sehmer/private_git/thw-tools/apps/inventar/src/lib/components/missions/QRCodeScannerModal.svelte`
**File 3:** `/Users/sehmer/private_git/thw-tools/apps/inventar/src/lib/components/missions/ManualMaterialModal.svelte`
**File 4:** `/Users/sehmer/private_git/thw-tools/apps/inventar/src/lib/components/missions/MaterialStatusModal.svelte`
*These component files will be created and populated in subsequent steps.*


---

## Stage 4: Final Verification

**Action:** Perform a manual end-to-end test using a tool like Postman or Insomnia to verify the backend API before building the frontend.

1.  **POST `/missions`**: Create a new mission. Verify you get a 201 response with the new mission object.
2.  **GET `/missions`**: Verify the new mission appears in the list.
3.  **POST `/missions/:id/scan`**: Use the ID from step 1 and a valid `inventoryItemId`. Verify the material is added.
4.  **POST `/missions/:id/scan` (again)**: Use the same ID and `inventoryItemId`. Verify you get the `{ "actionRequired": true, ... }` response.
5.  **POST `/missions/:id/manual-materials`**: Add a manual item. Verify it's created successfully.
6.  **GET `/missions/:id`**: Verify the mission details now include both the scanned and manual materials.
7.  **PATCH `/missions/:missionId/materials/:materialId`**: Update the status of a material. Verify the status changes.
8.  **PATCH `/missions/:id/complete`**: Complete the mission. Verify the status is updated to `COMPLETED`.

This concludes the backend implementation plan.
