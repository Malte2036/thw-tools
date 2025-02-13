import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Organisation } from 'src/organisation/entities/organisation.entity';
import { InventoryItemCustomData } from './inventory-item-custom-data.entity';

/**
 * Represents an inventory item in the system.
 */
@Entity({ name: 'inventory_items' })
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Organisation, { nullable: false })
  @JoinColumn({ name: 'organisation_id' })
  organisation: Organisation;

  @Column({ type: 'varchar', nullable: false })
  einheit: string;

  @Column({ type: 'int', nullable: false })
  ebene: number;

  @Column({ type: 'varchar', nullable: true })
  art: string;

  @Column({ type: 'float', nullable: true })
  menge: number;

  @Column({ type: 'float', nullable: true })
  mengeIst: number;

  @Column({ type: 'float', nullable: true })
  verfuegbar: number;

  @Column({ type: 'varchar', nullable: false })
  ausstattung: string;

  @Column({ type: 'varchar', nullable: true })
  hersteller: string;

  @Column({ type: 'varchar', nullable: true })
  typ: string;

  @Column({ type: 'varchar', nullable: true })
  inventarNummer: string;

  @Column({ type: 'varchar', nullable: true })
  sachNummer: string;

  @Column({ type: 'varchar', nullable: true })
  gerateNummer: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @OneToOne(
    () => InventoryItemCustomData,
    (customData) => customData.inventoryItem,
    { cascade: true },
  )
  @JoinColumn({ name: 'custom_data_id' })
  customData: InventoryItemCustomData;
}
