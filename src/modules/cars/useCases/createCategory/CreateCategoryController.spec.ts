import { app } from '@shared/infra/http/app'
import request from 'supertest'
import createConnection from '@shared/infra/typeorm'
import { Connection } from 'typeorm'
import { hash } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

let connection: Connection

describe('Create Category Controller', () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

        const id = uuidv4()
        const password = await hash('admin', 8)
        
        await connection.query(
            `INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
            VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'xxxxxxx')`
        )
    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

    it('should be able to create a new category', async () => {
        const responseToken = await request(app).post('/sessions').send({
            email: 'admin@rentx.com.br',
            password: 'admin'
        })

        const { token } = responseToken.body

        const response = await request(app)
            .post('/categories')
            .send({
                name: 'Category Supertest',
                description: 'Description Category Supertest'
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(201)
    })

    it('should not be able to create a new category when name already exists', async () => {
        const responseToken = await request(app).post('/sessions').send({
            email: 'admin@rentx.com.br',
            password: 'admin'
        })

        const { token } = responseToken.body

        const response = await request(app)
            .post('/categories')
            .send({
                name: 'Category Supertest',
                description: 'Description Category Supertest'
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(400)
    })
})