const schemaGenerator = {
    user: () => {
        return `{
    "model": {
        "name": "User",
        "description": "User entity",
        "displayName": "User"
    },
    "fields": [
        {
            "name": "name",
            "type": "String",
            "required": true
        },
        {
            "name": "email",
            "type": "String",
            "required": true,
            "unique": true
        },
        {
            "name": "password",
            "type": "String",
            "required": true
        },
        {
            "name": "role",
            "type": "String",
            "enum": ["admin", "user"],
            "default": "user"
        }
    ]
}`
    }
}

export default schemaGenerator;