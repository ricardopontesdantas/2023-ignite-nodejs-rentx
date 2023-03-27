import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { ICreateSpecificationDTO, ISpecificationsRepository } from "../ISpecificationsRepository";

class SpecificationsRepositoryInMemory implements ISpecificationsRepository {
    specifications: Specification[] = []

    async create({ name, description }: ICreateSpecificationDTO): Promise<void> {
        const specifications = new Specification()
        Object.assign(specifications, {
            name,
            description
        })
        this.specifications.push(specifications)
    }

    async findByName(name: string): Promise<Specification> {
        return this.specifications.find(specification => specification.name === name)
    }
    
    async findByIds(ids: string[]): Promise<Specification[]> {
        const allSpecifications = this.specifications.filter(specification => ids.includes(specification.id))
        return allSpecifications
    }
}

export { SpecificationsRepositoryInMemory }