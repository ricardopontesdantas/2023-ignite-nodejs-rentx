import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Entity('rentals')
class Rental {
    @PrimaryColumn()
    id: string

    @OneToOne(() => Car)
    @JoinColumn({ name: "car_id" })
    car: Car

    @Column()
    car_id: string

    @Column()
    user_id: string

    @Column()
    start_date: Date

    @Column()
    end_date: Date

    @Column()
    expected_return_date: Date

    @Column()
    total: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    constructor() {
        if(!this.id) {
            this.id = uuidv4()
        }
    }
}

export { Rental }