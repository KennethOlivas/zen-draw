
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking ...');
    // We don't need to run a query, just check if the type definition allows it technically.
    // But at runtime, we can check if the model def has the field in dmmf or just catch the error.
    // Actually, 'dmmf' is available on the client instance usually?
    // Let's just try to access the property in a way that would fail if not present in the schema.

    // @ts-ignore
    const dmmf = (prisma as any)._baseDmmf || (prisma as any)._dmmf
    if (dmmf) {
        const userModel = dmmf.datamodel.models.find((m: any) => m.name === 'User')
        if (userModel) {
            const settingsField = userModel.fields.find((f: any) => f.name === 'settings')
            if (settingsField) {
                console.log('FOUND_SETTINGS_FIELD');
            } else {
                console.log('MISSING_SETTINGS_FIELD');
            }
        } else {
            console.log('USER_MODEL_NOT_FOUND');
        }
    } else {
        console.log('DMMF_NOT_ACCESSIBLE');
    }
}

main()
    .catch(e => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
