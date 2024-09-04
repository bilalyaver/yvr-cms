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
    },
    media: () => {
        return `{
    "model": {
      "name": "Media",
      "description": "A schema for media files",
      "displayName": "Media"
    },
    "fields": [
      {
        "name": "name",
        "type": "String",
        "required": true,
        "unique": false,
        "defaultValue": ""
      },
      {
        "name": "type",
        "type": "String",
        "required": true,
        "unique": false,
        "defaultValue": ""
      },
      {
        "name": "size",
        "type": "Number",
        "required": true,
        "unique": false,
        "defaultValue": 0
      },
      {
        "name": "folder",
        "type": "ObjectId",
        "required": false,
        "unique": false,
        "referenceSchema": "Folder"
      },
      {
        "name": "user",
        "type": "ObjectId",
        "required": true,
        "unique": false,
        "referenceSchema": "User"
      },
      {
        "name": "tags",
        "type": "Array",
        "required": false,
        "unique": false,
        "defaultValue": []
      }
    ]
  }`
    },
    folder: () => {
        return `{
    "model": {
        "name": "Folder",
        "description": "Folder description",
        "displayName": "Folder"
    },
    "fields": [
        {
            "name": "name",
            "type": "String",
            "required": true,
            "unique": false,
            "defaultValue": "",
            "referenceSchema": ""
        },
        {
            "name": "parent",
            "type": "ObjectId",
            "required": false,
            "unique": false,
            "defaultValue": null,
            "referenceSchema": "Folder"
        },
        {
            "name": "user",
            "type": "ObjectId",
            "required": false,
            "unique": false,
            "defaultValue": "",
            "referenceSchema": "User"
        }
    ]
}
`
    }
}

const schemas = [
    {
        path: 'src/schemas/User.json',
        content: schemaGenerator.user()
    },
    {
        path: 'src/schemas/Media.json',
        content: schemaGenerator.media()
    },
    {
        path: 'src/schemas/Folder.json',
        content: schemaGenerator.folder()
    }
]

export default schemas;