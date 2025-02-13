import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

/**
 * Represents additional custom data associated with an inventory item.
 */
@Entity({ name: 'inventory_item_custom_data' })
export class InventoryItemCustomData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.customData, {
    onDelete: 'CASCADE',
  })
  inventoryItem: InventoryItem;

  @Column({ type: 'timestamp', nullable: true })
  lastScanned: Date;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  note: string;
}
