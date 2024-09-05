const clientComponents = [
    {
        path: 'client/components/collection/NewCollection.js',
        content: `import { schemaManager } from "yvr-core/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

const NewCollection = () => {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    if (!name) {
      toast({
        description: "Please enter a collection name",

      })
    }

    try {
      const schema = await schemaManager.create({name, displayName, description:"description"}, []);
      toast({
        description: schema.message,
        type: "success"
      })
      router.push('/collections');
    } catch (error) {
      toast({
        description: error.message,
      })
    }
  };

  useEffect(() => {
    if (displayName) {
      const turkishToEnglish = (str) => {
        const charMap = {
          'ç': 'c',
          'ğ': 'g',
          'ı': 'i',
          'İ': 'I',
          'ö': 'o',
          'ş': 's',
          'ü': 'u',
          'Ç': 'C',
          'Ğ': 'G',
          'Ö': 'O',
          'Ş': 'S',
          'Ü': 'U'
        };
        return str.replace(/[çğışüöÇĞİŞÜÖ]/g, char => charMap[char] || char);
      };
  
      const formattedName = turkishToEnglish(displayName)
        .toLowerCase() // Hepsini küçük harfe çevir
        .split(' ') // Boşluklara göre böl
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // İlk harfi büyük yap
        .join(''); // Kelimeleri birleştir
  
      setName(formattedName);
    } else {
      setName('');
    }
  }, [displayName]);


  return (
    <div>
      <div className="grid md:grid-cols-2 space-x-5">
        <div className="space-y-3">
          <Label htmlFor="displayName">Collection Display Name</Label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            name="displayName" id="displayName" placeholder="Collection Display Name" />
        </div>
        <div className="space-y-3">
          <Label htmlFor="name">Collection Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name" id="name" placeholder="Collection Name" />
        </div>
      </div>
      <Button
        className="mt-5"
        onClick={handleSubmit}>Create Collection</Button>
    </div>
  );
}

export default NewCollection;
`
    },
    {
        path: 'client/components/collection/CollectionNavigate.js',
        content: `
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { schemaManager } from "yvr-core/client";

const CollectionNavigate = () => {
    const [collectionList, setCollectionList] = useState([]);
    const router = useRouter();
    const path = router.pathname;
    const { collectionName } = router.query;
    const pageName = path.split("/")[2];

    const getCollections = async () => {
        const schema = await schemaManager.loadAll();
        setCollectionList(schema.map((s) => s.model));

    }

    useEffect(() => {
        getCollections();
    }, []);

    return (
        <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
            <Link href="/collections/new" className={\`\${pageName == "new" && "font-semibold text-primary"}\`} prefetch={false}>
                New Collection +
            </Link>
            {
                collectionList?.map((collection) => (
                    <Link key={collection.name} href={\`/collections/\${collection.name}\`} className={\`\${collectionName == collection.name && "font-semibold text-primary"}\`} prefetch={false}>
                        {collection.name}
                    </Link>
                ))
            }
        </nav>
    );
}

export default CollectionNavigate;
`
    },
    {
        path: 'client/components/collection/ContentTypeBuilder.js',
        content: `import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EditIcon } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { schemaManager } from "yvr-core/client";
import { useRouter } from "next/router"
import { toast } from "@/hooks/use-toast";
import TypeIcon from '../contentManagement/TypeIcon'

const contentTypes = [
    { id: 'String', name: 'String' },
    { id: 'Number', name: 'Number' },
    { id: 'Boolean', name: 'Boolean' },
    { id: 'Date', name: 'Date' },
    { id: 'ObjectId', name: 'ObjectId' },
    { id: 'Media', name: 'Media' },
    { id: 'Slug', name: 'Slug' },
    { id: 'RichText', name: 'Rich Text Editor' },
]

export default function ContentTypeBuilder({ editFieldName }) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [selectedType, setSelectedType] = useState('')
    const [fieldName, setFieldName] = useState('')
    const [isRequired, setIsRequired] = useState(false)
    const [isUnique, setIsUnique] = useState(false)
    const [defaultValue, setDefaultValue] = useState('')
    const [schemas, setSchemas] = useState([]);
    const [model, setModel] = useState({});
    const [fields, setFields] = useState([]);
    const [referenceSchema, setReferenceSchema] = useState("");
    const [slugSource, setSlugSource] = useState("");

    const router = useRouter();
    const { collectionName } = router.query;

    // Eski useEffect fonksiyonlarını aktarma
    useEffect(() => {
        if (fields && editFieldName) {
            const foundField = fields?.find(f => f.name == editFieldName);
            setFieldName(foundField?.name);
            setSelectedType(foundField?.type);
            setIsRequired(foundField?.required);
            setIsUnique(foundField?.unique);
            setDefaultValue(foundField?.defaultValue);
            setReferenceSchema(foundField?.referenceSchema);
            setSlugSource(foundField?.slugSource);
        }
    }, [fields, editFieldName]);

    const handleTypeSelect = (typeId) => {
        setSelectedType(typeId)
        setStep(1)
    }

    useEffect(() => {
        if (editFieldName) {
            setStep(1)
        }
    }, [editFieldName]);

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1)
            setFieldName('')
            setIsRequired(false)
            setIsUnique(false)
            setDefaultValue('')
            setReferenceSchema('')
            setSlugSource('')
        }
    }

    const handleFinish = async () => {
        if (!fieldName || !selectedType) {
            toast({
                description: "Please fill all the fields",
            })
            return;
        }

        let newFields;

        if (editFieldName) {
            newFields = fields.map(f => {
                if (f.name == editFieldName) {
                    return {
                        name: fieldName,
                        type: selectedType,
                        required: isRequired,
                        unique: isUnique,
                        defaultValue: defaultValue,
                        referenceSchema,
                        slugSource
                    }
                }
                return f;
            });
        } else {
            newFields = [...fields, {
                name: fieldName,
                type: selectedType,
                required: isRequired,
                unique: isUnique,
                defaultValue: defaultValue,
                referenceSchema,
                slugSource
            }];
        }

        try {
            const data = await schemaManager.update(model, newFields);
            toast({
                description: "Field added successfully",
                type: "success"
            })
            router.reload();
        } catch (error) {
            toast({
                description: error.message,
            })
        }

        setOpen(false)
        setStep(0)
        setSelectedType('')
        setFieldName('')
        setIsRequired(false)
        setIsUnique(false)
        setDefaultValue('')
        setReferenceSchema('')
        setSlugSource('')
    }

    const getFields = async () => {
        try {
            const schema = await schemaManager.load(collectionName);
            setFields(schema?.fields || []);
            setModel(schema?.model || {});
        } catch (error) {
            toast({
                description: error.message,
            })
        }
    }

    useEffect(() => {
        collectionName && getFields();
    }, [collectionName]);

    const getSchemas = async () => {
        const schemas = await schemaManager.loadAll();
        setSchemas(schemas);
    }

    useEffect(() => {
        selectedType == "ObjectId" && getSchemas();
        selectedType == "media" && setReferenceSchema("Media");
    }, [selectedType]);

    const renderDefaultValueInput = () => {
        switch (selectedType) {
            case 'string':
                return <Input type="text" id="defaultValue" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} />
            case 'number':
                return <Input type="number" id="defaultValue" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} />
            case 'boolean':
                return (
                    <Switch
                        id="defaultValue"
                        className="block"
                        checked={defaultValue == 'true'}
                        onCheckedChange={(checked) => setDefaultValue(checked ? 'true' : 'false')}
                    />
                )
            case 'date':
                return <Input type="date" id="defaultValue" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} />
            default:
                return null
        }
    }

    const renderNameInput = () => {
        switch (selectedType) {
            default:
                return (
                    <div className="space-y-2">
                        <Label htmlFor="fieldName">Field Name</Label>
                        <Input
                            id="fieldName"
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
                            placeholder="Enter field name"
                        />
                    </div>
                )
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Select Content Type</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {contentTypes.map((type) => {
                                return (
                                    <Button
                                        key={type.id}
                                        variant="outline"
                                        className="h-auto py-4 px-4 flex flex-col items-center justify-center"
                                        onClick={() => handleTypeSelect(type.id)}
                                    >
                                        <TypeIcon type={type.id} />
                                        <span>{type.name}</span>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Configure {selectedType} Field</h2>
                        {renderNameInput()}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="required"
                                checked={isRequired}
                                onCheckedChange={(checked) => setIsRequired(checked)}
                            />
                            <Label htmlFor="required">Required</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="unique"
                                checked={isUnique}
                                onCheckedChange={(checked) => setIsUnique(checked)}
                            />
                            <Label htmlFor="unique">Unique</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="defaultValue">Default Value</Label>
                            {renderDefaultValueInput()}
                        </div>
                        {selectedType === "ObjectId" && (
                            <div className="space-y-2">
                                <Label htmlFor="referenceSchema">Reference Schema</Label>
                                <Select
                                    onValueChange={(e) => setReferenceSchema(e)}
                                    value={referenceSchema}
                                    id="field-reference-schema"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select reference schema" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {schemas.map((schema) => (
                                            <SelectItem key={schema?.model?.name} value={schema?.model?.name}>
                                                {schema?.model?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {selectedType == "Slug" && (
                            <div className="space-y-2">
                                <Label htmlFor="slugSource">Slug Source</Label>
                                <Select
                                    onValueChange={(e) => setSlugSource(e)}
                                    value={slugSource}
                                    id="field-slug-source"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select slug source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fields.filter(f => f.type == "String").map((field, index) => (
                                            <SelectItem key={index} value={field?.name}>
                                                {field?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="p-4">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {editFieldName ? <EditIcon className="h-5 w-5" /> : <Button variant="default">New Content Type</Button>}

                </DialogTrigger>
                <DialogContent className="sm:max-w-[50vw]">
                    <DialogHeader>
                        <DialogTitle>Create New Content Type</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        {renderStep()}
                    </div>
                    <div className="mt-6 flex justify-between">
                        {step > 0 && (
                            <Button variant="outline" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        {step > 0 && (
                            <Button onClick={handleFinish} disabled={!fieldName}>
                                Finish
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}`
    },
    {
        path: 'client/components/collection/FieldList.js',
        content: `import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { schemaManager } from "yvr-core/client";
import { toast } from "@/hooks/use-toast";
import { Type, Hash, ToggleLeft, Calendar, Key, Image, Link } from 'lucide-react'
import TypeIcon from "../contentManagement/TypeIcon";
import ContentTypeBuilder from "./ContentTypeBuilder";

const FieldList = ({ collection }) => {
    const router = useRouter();
    const { collectionName } = router.query;

    const deleteField = async (field) => {

        const model = collection.model;

        const newFields = collection.fields.filter(f => f.name !== field.name);

        try {
            const data = await schemaManager.update(model, newFields);
            console.log(data);
            toast({
                description: "Field added successfully",
                type: "success"
            })
            router.reload();
        } catch (error) {
            toast({
                description: error.message,
            })
        }
    };

    return (
        <div className="z-40">
            <Table>
                <TableCaption>
                    Fields
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Default Value</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Unique</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {collection?.fields?.map((field, index) => (
                        <TableRow 
                        key={index}
                        className="cursor-pointer"
                        >
                            <TableCell className="font-medium">{field.name}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-x-2 h-full">
                                    <TypeIcon type={field.type} size={14} />
                                    {field.type}
                                </div>
                            </TableCell>
                            <TableCell>{field.defaultValue}</TableCell>
                            <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                            <TableCell>{field.unique ? "Yes" : "No"}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="w-10 h-10 p-0">
                                        <ContentTypeBuilder editFieldName={field.name} />
                                        
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => deleteField(field)}
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default FieldList;`
    },
    {
        path: 'client/components/Login.js',
        content: `
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/router"
import { setCookie } from 'cookies-next';
import { api } from "yvr-core/client";


const apiBaseUrl = process.env.API_BASE_URL;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                description: "Please fill all fields",
                variant: "destructive"
            });
            return;
        }

        try {
            const data = await api.post(\`/user:login\`, { email, password });
            if (data.token) {
                setCookie("token", data.token, {
                    maxAge: 24 * 60 * 60, // 24 hours
                });
                router.push("/");
            } else {
                toast({
                    description: data.error,
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                description: error.response.data.error,
                variant: "destructive"
            });
        }
    }
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <title>Login Page</title>
            <h1 className="text-4xl font-bold mb-4">
                Admin Panel
            </h1>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Please login to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            id="password"
                            placeholder="********"
                            type="password" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSubmit}
                        className="w-full">
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}`
    },
    {
        path: 'client/components/Register.js',
        content: `
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/router"
import { setCookie } from 'cookies-next';
import { api } from "yvr-core/client";


const apiBaseUrl = process.env.API_BASE_URL;

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !name) {
            toast({
                description: "Please fill all fields",
                variant: "destructive"
            });
            return;
        }

        try {
            const data = await api.post(\`/user:create\`, { email, password, name, role: "admin" });
            if (data.error) {
                toast({
                    description: data.error,
                    variant: "destructive"
                });
                return;
            } else {
                toast({
                    description: "User created successfully",
                    variant: "success"
                });
                router.push("/login");
            }
            
        } catch (error) {
            // toast({
            //     description: error.response.data.message,
            //     variant: "destructive"
            // });
        }
    }
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <title>Register Page</title>
            <h1 className="text-4xl font-bold mb-4">
                Admin Panel
            </h1>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Please register to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            id="name" type="string" placeholder="Name" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            id="password"
                            placeholder="********"
                            type="password" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSubmit}
                        className="w-full">
                        Register
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
`
    },
    {
        path: 'client/components/contentManagement/ContentManagementNavigate.js',
        content: `
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { schemaManager } from "yvr-core/client";

const ContentManagementNavigate = () => {
    const [collectionList, setCollectionList] = useState([]);
    const router = useRouter();
    const path = router.pathname;
    const { collectionName } = router.query;

    const getCollections = async () => {
        const schema = await schemaManager.loadAll();
        setCollectionList(schema.map((s) => s.model));

    }

    useEffect(() => {
        getCollections();
    }, []);

    return (
        <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
            {
                collectionList?.map((collection) => (
                    <Link key={collection.name} href={\`/content-management/\${collection.name}\`} className={\`\${collectionName == collection.name && "font-semibold text-primary"}\`} prefetch={false}>
                        {collection.name}
                    </Link>
                ))
            }
        </nav>
    );
}

export default ContentManagementNavigate;
`
    },
    {
        path: 'client/components/contentManagement/CollectionList.js',
        content: `import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { api, schemaManager } from 'yvr-core/client';
import ContentManagementTable from './ContentManagementTable';

const CollectionList = () => {
    const [list, setList] = useState([]);
    const [count, setCount] = useState(0);
    const [mediaTypes, setMediaTypes] = useState("");


    const router = useRouter();
    const { collectionName } = router.query;

    const getList = async () => {
        const { list, count } = await api.get(\`/\${collectionName}:getAll?populate=\${mediaTypes}\`);
        setList(list);
        setCount(count);
    }

    const getSchema = async () => {
        const schema = await schemaManager.load(collectionName);
        const mediaTypes = schema.fields.filter(field => field.type == 'Media').map(field => field.name);
        setMediaTypes(mediaTypes.join(','));
    }

    useEffect(() => {
        if (collectionName) {
            
            getSchema();
        }

    }, [collectionName]);

    useEffect(() => {
        collectionName && getList();
    }, [mediaTypes, collectionName]);

    return (
        <div>
            {list?.length > 0 && <ContentManagementTable list={list} count={count} getList={getList} />}
        </div>
    );
}

export default CollectionList;`
    },
    {
        path: 'client/components/contentManagement/ContentManagementTable.js',
        content: `import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/router"
import { schemaManager } from "yvr-core/client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "yvr-core/client"
import { toast } from "@/hooks/use-toast"

const imagePath = process.env.IMAGE_PATH

export default function ContentManagementTable({ list, getList }) {
    const [columns, setColumns] = useState([]);
    const [filterColumn, setFilterColumn] = useState("");

    const router = useRouter();
    const { collectionName } = router.query;

    const deleteItem = async (id) => {
        const data = await api.delete(\`/\${collectionName}:delete?id=\${id}\`);
        if (data?.error) {
            toast({
                description: data.error,
                variant: "destructive",
            });
        } else {
            toast({
                description: "Item deleted successfully",
            });
            getList();
        }
    };

    const columnsDefault = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="capitalize cursor-pointer"
                                onClick={() => navigator.clipboard.writeText(JSON.stringify(item))}
                            >
                                Copy Object
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="capitalize cursor-pointer"
                            >
                                <Link className="w-full" href={\`/content-management/\${collectionName}/\${item._id}\`}>
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="capitalize cursor-pointer hover:bg-red-600 hover:text-white"
                                onClick={() => deleteItem(item._id)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            accessorKey: "Actions",
        },
    ]

    const getSchema = async () => {
        try {
            let { fields } = await schemaManager.load(collectionName);


            const mediaTypes = fields.filter(field => field.type == 'Media');

            fields = fields.filter(field => field.name !== 'password'); // Şifre alanını çıkartıyoruz
            fields = fields.filter(field => field.type !== 'Media'); // Oluşturulma tarihini çıkartıyoruz
            fields = fields.filter(field => field.type !== 'RichText'); // Oluşturulma tarihini çıkartıyoruz

            console.log('mediaTypes', mediaTypes)

            // Dinamik sütunlar
            let tempColumns = [
                columnsDefault[0],
                ...fields.map(field => ({
                    accessorKey: field.name,
                    header: field.name.charAt(0).toUpperCase() + field.name.slice(1),
                    cell: ({ row }) => <div>{row.getValue(field.name)}</div>,
                })),
                mediaTypes.length > 0 ? {
                    accessorKey: mediaTypes[0].name,
                    header: mediaTypes[0].name.charAt(0).toUpperCase() + mediaTypes[0].name.slice(1),
                    cell: ({ row }) => {
                        return (<div>
                            {row?.getValue(mediaTypes[0].name) && <img 
                            onClick={(e) => { 
                                e.stopPropagation();
                                window.open(\`\${imagePath}/\${row?.getValue(mediaTypes[0].name)?.name}\`, '_blank');
                            }}
                            src={\`\${imagePath}/\${row?.getValue(mediaTypes[0].name)?.name}\`} alt="Selected" className="w-8 h-8 object-cover rounded-full cursor-pointer" />}
                        </div>)
                    },
                } : null,
                columnsDefault[columnsDefault.length - 1]
            ];


            // ilk üçünün seçili olmasını sağla
            tempColumns = tempColumns.map((column, index) => {
                if (index < 3) {
                    return {
                        ...column,
                        isVisible: true,
                    };
                }
                return column;
            });

            setColumns(tempColumns);

            // Filtre için varsayılan olarak ilk kolonu kullan
            setFilterColumn(fields.length > 0 ? fields[0].name : "");
        } catch (error) {
            console.error("Error loading schema:", error);
        }
    }

    useEffect(() => {
        collectionName && getSchema();
    }, [collectionName]);

    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: list,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder={\`Filter by \${filterColumn}\`}
                    value={(table?.getColumn(filterColumn)?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table?.getColumn(filterColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table?.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => router.push(\`/content-management/\${collectionName}/\${row.original._id}\`)}
                                    className="cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}`
    },
    {
        path: 'client/components/contentManagement/NewContent.js',
        content: `import { useRouter } from "next/router";
import { schemaManager } from "yvr-core/client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from 'yvr-core/client';
import ContentTypes from "./contentTypes/ContentTypes";
import { toast } from "@/hooks/use-toast";

const NewContent = () => {
    const [schema, setSchema] = useState(null);
    const [formData, setFormData] = useState({});

    const router = useRouter();
    const { collectionName, id } = router.query;

    const getSchema = async () => {
        const schema = await schemaManager.load(collectionName);
        setSchema(schema);
    }

    useEffect(() => {
        collectionName && getSchema();
    }, [collectionName]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const createSubmit = async (e) => {
        e.preventDefault();
        const data = await api.post(\`/\${collectionName}:create\`, formData);
        if (data?.error) {
            console.log("error", data.error);
            toast({
                description: data.error,
                variant: "destructive",
            });
        } else {
            toast({
                description: "Item created successfully",
            });
            router.push(\`/content-management/\${collectionName}\`);
        }
    };

    const getItem = async () => {
        const item = await api.get(\`/\${collectionName}:get?filter.id=\${id}\`);
        setFormData(item);
    };

    useEffect(() => {
        id && getItem();
    }, [id, router.query]);

    const updateSubmit = async (e) => {
        e.preventDefault();
        const data = await api.put(\`/\${collectionName}:update?id=\${id}\`, formData);
        if (data?.error) {
            console.log("error", data.error);
            toast({
                description: data.error,
                variant: "destructive",
            });
        } else {
            toast({
                description: "Item updated successfully",
            });
            router.push(\`/content-management/\${collectionName}\`);
        }
    };

    console.log("formData", formData);

    return (
        <div>
            <h1
                className="text-2xl font-semibold"
            >
                {id ? "Edit" : "Create"}
                {" "}
                {collectionName}
            </h1>
            <div className="mt-5">
                <form onSubmit={id ? updateSubmit : createSubmit} className="space-y-4">
                    <ContentTypes schema={schema} formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                    <div>
                        <Button type="submit" >
                            {id ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewContent;`
    },
    {
        path: 'client/components/contentManagement/TypeIcon.js',
        content: `import { Type, Hash, ToggleLeft, Calendar, Key, Image, Link, BookType } from 'lucide-react'

const TypeIcon = ({ type, size = 24 }) => {

    const icon = {
        'String': <Type size={size} />,
        'Number': <Hash size={size} />,
        'Boolean': <ToggleLeft size={size} />,
        'Date': <Calendar size={size} />,
        'ObjectId': <Key size={size} />,
        'Media': <Image size={size} />,
        'Slug': <Link size={size} />,
        'RichText': <BookType size={size} />
    }

    return (
        <div>
            {icon[type]}
        </div>
    );
}

export default TypeIcon;`
    },
    {
        path: 'client/components/contentManagement/contentTypes/ContentTypes.js',
        content: `import StringType from "./StringType";
import ObjectId from "./ObjectId";
import MediaType from "./MediaType";
import SlugType from "./SlugType";
import BooleanType from "./BooleanType";
import dynamic from 'next/dynamic';
const RichTextType = dynamic(
    () => import('./RichTextType'),
    { ssr: false }
);

export default function ContentTypes({
    schema,
    formData,
    handleChange,
    handleSelectChange
}) {

    console.log('schema', schema)
    return (
        <>
            {schema?.fields?.map((field, index) => {
                if (field.type == "String" && !field.enum) {
                    return <StringType key={index} field={field} formData={formData} handleChange={handleChange} />
                }

                if (field.type == "ObjectId") {
                    return <ObjectId key={index} field={field} formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                }

                if(field.type == "Slug") {
                    return <SlugType key={index} field={field} formData={formData} handleChange={handleChange} />
                }

                if(field.type == "Boolean") {
                    return <BooleanType key={index} field={field} formData={formData} handleChange={handleChange} />
                }

                if(field.type == "Media") {
                    return <MediaType key={index} field={field} formData={formData} handleChange={handleChange} />
                }

                if(field.type == "RichText") {
                    return <RichTextType key={index} field={field} formData={formData} handleChange={handleChange} />
                }


                return null; // Eğer tanımlı olmayan bir type varsa
            })}
        </>
    );
}
`
    },
    {
        path: 'client/components/contentManagement/contentTypes/StringType.js',
        content: `import { Input } from "@/components/ui/input"; // Varsayılan input bileşeni
import { Label } from "@/components/ui/label";

const StringType = ({
    field,
    formData,
    handleChange,
}) => {
    return (
        <div>
            {
                field.type === "String" && !field.enum && (
                    <div key={field.name} className="grid gap-2">
                        <Label htmlFor={field.name}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type="text"
                            required={field.required}
                            value={formData[field?.name] || ""}
                            onChange={handleChange}
                            placeholder={\`Enter \${field.name}\`}
                        />
                    </div>
                )
            }
                {
                    field.enum && field.type === "String" && (
                        <div key={field.name} className="grid gap-2">
                            <Label htmlFor={field.name}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Label>
                            <Select
                                value={formData[field.name]}
                                onValueChange={(value) => handleSelectChange(field.name, value)}
                            >
                                <SelectTrigger id={field.name}>
                                    <SelectValue placeholder={\`Select \${field.name}\`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.enum.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )
                }
        </div>
    );
}

export default StringType;`
    },
    {
        path: 'client/components/contentManagement/contentTypes/ObjectId.js',
        content: `import { Input } from "@/components/ui/input"; // Varsayılan input bileşeni
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { api } from 'yvr-core/client';
import { useState, useEffect } from 'react';

const ObjectId = ({
    field,
    formData,
    handleChange,
    handleSelectChange,
}) => {
    const [references, setReferences] = useState([]);

    const getReferences = async () => {
        const { list } = await api.get(\`/\${field.referenceSchema}:getAll\`);
        setReferences(list);
    }

    useEffect(() => {
        field.referenceSchema && getReferences();
    }, [field.referenceSchema]);


    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Label>
            <Select
                value={formData[field.name]}
                onValueChange={(value) => {
                    value && handleSelectChange(field.name, value);
                }}
            >
                <SelectTrigger id={field.name}>
                    <SelectValue placeholder={\`Select \${field.name}\`} />
                </SelectTrigger>
                <SelectContent>
                    {references?.map((option, index) => (
                        <SelectItem key={index} value={option?._id}>
                            {option?.name?.charAt(0).toUpperCase() + option?.name?.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default ObjectId;`
    },
    {
        path: 'client/components/contentManagement/contentTypes/MediaType.js',
        content: `import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog"
import MediaManagementPanel from "../mediaManagementPanel/MediaManagementPanel";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { api } from 'yvr-core/client';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

const imagePath = process.env.IMAGE_PATH

const MediaType = ({
    field,
    formData,
    handleChange,
}) => {
    const [selectedImage, setSelectedImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const getSelectedImage = async () => {
        const result = await api.get(\`/media:get?filter.id=\${formData[field.name]}\`);
        setSelectedImage(formData[field.name]);
        setImageUrl(\`\${imagePath}/\${result?.name}\`);
    }

    useEffect(() => {
        formData[field.name] &&
            getSelectedImage();
    }, [formData[field.name]], field.name, selectedImage);


    console.log('selectedImage', selectedImage)

    useEffect(() => {
        handleChange({
            target: {
                name: field.name,
                value: selectedImage
            }
        })
    }, [selectedImage]);

    console.log('imageUrl', imageUrl)

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Label>
            <Dialog className="block" open={isOpenModal} onOpenChange={setIsOpenModal}>
                <DialogTrigger asChild className="text-muted-foreground transition-colors hover:text-foreground w-40">
                    <div className="w-full max-w-md">
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                        >
                            {selectedImage ? (
                                <img src={imageUrl} alt="Selected" className="w-full h-56 object-cover rounded" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-56  rounded">
                                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                                    <Button type="button" variant="outline">Select Image</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="min-w-[90vw] min-h-[90vh] overflow-scroll">
                    <VisuallyHidden.Root>
                        <DialogTitle>Media Management</DialogTitle >
                    </VisuallyHidden.Root>
                    <MediaManagementPanel
                        openType="select"
                        setSelectedImage={setSelectedImage}
                        selectedImage={selectedImage}
                        setIsOpenModal={setIsOpenModal}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default MediaType;`
    },
    {
        path: 'client/components/contentManagement/contentTypes/SlugType.js',
        content: `import { Input } from "@/components/ui/input"; // Varsayılan input bileşeni
import { Label } from "@/components/ui/label";
import slugify from 'slugify'; // Slugify kütüphanesi
import { useEffect } from 'react';

const SlugType = ({
    field,
    formData,
    handleChange,
}) => {
    const slugSource = formData[field.slugSource] || '';

    useEffect(() => {
        if (field.slugSource) {
            handleChange({
                target: {
                    name: field.name,
                    value: slugify(slugSource,
                        { lower: true, remove: /[*+~.()'"!:@]/g })
                }
            });
        }
    }, [slugSource, formData[field.slugSource]]);


    return (
        <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Label>
            <Input
                id={field.name}
                name={field.name}
                type="text"
                required={field.required}
                value={slugify(slugSource,
                    { lower: true, remove: /[*+~.()'"!:@]/g })}
                onChange={handleChange}
                placeholder={\`Enter \${field.name}\`}
                disabled
            />
        </div>
    );
}

export default SlugType;`
    },
    {
        path: 'client/components/contentManagement/contentTypes/BooleanType.js',
        content: `import { Checkbox } from "@/components/ui/checkbox"; // Varsayılan checkbox bileşeni
import { Label } from "@/components/ui/label";

const BooleanType = ({
    field,
    formData,
    handleChange,
}) => {
    return (
        <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Label>
            <Checkbox
                id={field.name}
                name={field.name}
                checked={formData[field.name] || false}
                onCheckedChange={(checked) => handleChange({ target: { name: field.name, value: checked } })}
            >
                {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
            </Checkbox>
        </div>
    );
}

export default BooleanType;`
    },
    {
        path: 'client/components/contentManagement/contentTypes/RichTextType.js',
        content: `import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
    ClassicEditor,
    AccessibilityHelp,
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BlockQuote,
    Bold,
    CloudServices,
    Code,
    CodeBlock,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Italic,
    Link,
    LinkImage,
    Paragraph,
    SelectAll,
    ShowBlocks,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline,
    Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const RichTextType = ({ field, formData, handleChange }) => {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    const editorConfig = {
        extraPlugins: [CustomUploadAdapterPlugin],
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'showBlocks',
                'findAndReplace',
                'selectAll',
                '|',
                'heading',
                '|',
                'fontSize',
                'fontFamily',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                '|',
                'specialCharacters',
                'horizontalLine',
                'link',
                'insertTable',
                'blockQuote',
                '|',
                'alignment',
                '|',
                'imageUpload',
                'accessibilityHelp'
            ],
            shouldNotGroupWhenFull: true
        },
        plugins: [
            AccessibilityHelp,
            Alignment,
            Autoformat,
            AutoImage,
            AutoLink,
            Autosave,
            BlockQuote,
            Bold,
            CloudServices,
            Code,
            CodeBlock,
            Essentials,
            FindAndReplace,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            GeneralHtmlSupport,
            Heading,
            HorizontalLine,
            HtmlComment,
            HtmlEmbed,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Italic,
            Link,
            LinkImage,
            Paragraph,
            SelectAll,
            ShowBlocks,
            SourceEditing,
            SpecialCharacters,
            SpecialCharactersArrows,
            SpecialCharactersCurrency,
            SpecialCharactersEssentials,
            SpecialCharactersLatin,
            SpecialCharactersMathematical,
            SpecialCharactersText,
            Strikethrough,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            Underline,
            Undo
        ],
        fontFamily: {
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
        htmlSupport: {
            allow: [
                {
                    name: /^.*$/,
                    styles: true,
                    attributes: true,
                    classes: true
                }
            ]
        },
        image: {
            styles: ['alignLeft', 'alignCenter', 'alignRight', 'alignBlock', 'alignInline', 'maxHeight'],
            toolbar: ['toggleImageCaption', 'imageTextAlternative', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'],
        },
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        placeholder: 'Type or paste your content here!',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    };
    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Label>
            <div className='h-full'>
                <div className="main-container text-black">
                    <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                        <div className="editor-container__editor">
                            <div ref={editorRef}>{isLayoutReady &&
                                <CKEditor
                                    data={formData[field.name]}
                                    onChange={(event, editor) => {
                                        const data = editor?.getData();
                                        handleChange({
                                            target: {
                                                name: field.name,
                                                value: data
                                            }
                                        });
                                    }}
                                    onReady={(editor) => {
                                        editor?.editing?.view?.change((writer) => {
                                            writer.setStyle(
                                                "height",
                                                "500px",
                                                editor?.editing?.view?.document?.getRoot()
                                            );
                                        });
                                    }}
                                    editor={ClassicEditor} config={editorConfig} />}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// Custom upload adapter plugin
function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new CustomUploadAdapter(loader);
    };
}

class CustomUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({ default: reader.result });
                };
                reader.onerror = error => {
                    reject(error);
                };
                reader.readAsDataURL(file);
            }));
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }
}

export default RichTextType;`
    },
    {
        path: 'client/components/contentManagement/mediaManagementPanel/MediaManagementMain.js',
        content: `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import MediaManagementPanel from "./MediaManagementPanel"
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export default function MediaManagementMain() {
  return (
    <Dialog>
      <DialogTrigger asChild className="text-muted-foreground transition-colors hover:text-foreground w-40">
        <Button className="text-muted-foreground transition-colors hover:text-foreground w-40">Media Management</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] min-h-[90vh] overflow-scroll">
        <VisuallyHidden.Root>
          <DialogTitle>Media Management</DialogTitle >
        </VisuallyHidden.Root>
        <MediaManagementPanel />
      </DialogContent>
    </Dialog>
  )
}
`
    },
    {
        path: 'client/components/contentManagement/mediaManagementPanel/MediaManagementPanel.js',
        content: `import { useState, useEffect, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Trash2, Search, Grid, List, Folder, ArrowLeft, Plus, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { api, mediaManager } from 'yvr-core/client'
import MediaManagementImageEdit from './MediaManagementImageEdit'

const imagePath = process.env.IMAGE_PATH

export default function MediaManagementPanel({ openType, setSelectedImage, selectedImage, setIsOpenModal }) {
    const [folders, setFolders] = useState([])
    const [items, setItems] = useState([])
    const [currentFolder, setCurrentFolder] = useState(null);
    const [currentFolderId, setCurrentFolderId] = useState(null)
    const [view, setView] = useState('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef(null)
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')

    const getFolders = async () => {
        try {
            const { list } = await api.get(\`/folder:getAll?filter.parent=\${currentFolderId}\`);
            setFolders(list);
        } catch (error) {
            toast({
                description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            })
        }
    };

    const getCurrentFolder = async () => {
        try {
            const folder = await api.get(\`/folder:get?id=\${currentFolderId}\`);
            setCurrentFolder(folder);
        } catch (error) {
            toast({
                description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            })
        }
    };

    useEffect(() => {
        getFolders();
    }, [currentFolderId]);

    useEffect(() => {
        currentFolderId ? getCurrentFolder() : setCurrentFolder(null);
    }, [currentFolderId]);

    const getItems = async () => {
        try {
            const { list } = await api.get(\`/media:getAll?filter.folder=\${currentFolderId}\`);
            setItems(list);
        } catch (error) {
            toast({
                description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            })
        }
    };

    useEffect(() => {
        getItems();
    }, [currentFolderId]);

    const currentFolderName = currentFolderId
        ? folders.find(folder => folder._id == currentFolderId)?.name
        : 'Root'

    const filteredFolders = folders.filter(folder =>
        folder.parent == currentFolderId &&
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    )


    const filteredItems = items.filter(item =>
        item.folder == currentFolderId &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )


    const handleDelete = async (id, isFolder) => {
        try {
            if (isFolder) {
                await mediaManager.deleteFolder(id)
                getFolders()
            } else {
                await mediaManager.deleteFile(id)
                getItems()
            }
        } catch (error) {
            toast({
                description: error.message,
            })
        }
    }

    const handleUpload = useCallback((acceptedFiles) => {
        setUploading(true);
        setUploadProgress(0);

        const totalFiles = acceptedFiles.length;
        const progressMap = {}; // Her dosya için ilerleme yüzdesini saklar
        let completedUploads = 0;

        const updateProgress = () => {
            const totalProgress = Object.values(progressMap).reduce((acc, progress) => acc + progress, 0);
            setUploadProgress(Math.round(totalProgress / totalFiles));
        };

        mediaManager.uploadFiles(acceptedFiles, {
            folder: currentFolderId,
            onProgress: (file, progress) => {
                progressMap[file.name] = progress;
                updateProgress();
            },
            onSuccess: (file) => {
                completedUploads++;
                if (completedUploads === totalFiles) {
                    setUploading(false);
                    setUploadProgress(0);
                    getItems();
                }
            },
            onError: (error) => {
                setUploading(false);
                setUploadProgress(0);
                toast({
                    description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
                })
            },
            user: '66cb7ac3b6733b3bd5386564'
        })

    }, [currentFolderId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleUpload,
        accept: {
            'image/*': [],
            'video/*': [],
            'application/pdf': []
        },
        noClick: true
    })

    const handleCreateFolder = async () => {
        if (newFolderName.trim()) {
            const newFolder = {
                name: newFolderName.trim(),
                parent: currentFolderId,
                user: '66cb7ac3b6733b3bd5386564'
            }
            await api.post('/folder:create', newFolder)
            getFolders()
            setNewFolderName('')
            setIsNewFolderModalOpen(false)
        }
    }

    const handleOpenFolder = (folder) => {
        setCurrentFolderId(folder._id)
    }

    const handleGoBack = () => {
        setCurrentFolderId(currentFolder?.parent || null)
    }


    const handleAreaClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="w-full mx-auto p-4 overflow-scroll max-h-screen">
            <h1 className="text-2xl font-bold mb-4">Medya Yönetim Paneli</h1>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Medya ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                    <Search className="text-gray-400" />
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => setView('grid')} variant={view === 'grid' ? 'default' : 'outline'}>
                        <Grid className="w-4 h-4 mr-2" />
                        <span className="sr-only">Grid görünümü</span>
                        Grid
                    </Button>
                    <Button onClick={() => setView('list')} variant={view === 'list' ? 'default' : 'outline'}>
                        <List className="w-4 h-4 mr-2" />
                        <span className="sr-only">Liste görünümü</span>
                        Liste
                    </Button>
                    <Dialog open={isNewFolderModalOpen} onOpenChange={setIsNewFolderModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="sr-only">Yeni klasör oluştur</span>
                                Yeni Klasör
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Yeni Klasör Oluştur</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="folderName" className="text-right">
                                        Klasör Adı
                                    </Label>
                                    <Input
                                        id="folderName"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsNewFolderModalOpen(false)}>İptal</Button>
                                <Button onClick={handleCreateFolder}>Oluştur</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="mb-4">
                <Button onClick={handleGoBack} disabled={currentFolderId == null}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="sr-only">Üst klasöre dön</span>
                    Geri
                </Button>
                <span className="ml-2 font-semibold">{currentFolder?.name || "Root"}</span>
            </div>

            <div
                {...getRootProps()}
                className={\`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer \${isDragActive ? 'border-primary' : 'border-gray-300'}\`}
                onClick={handleAreaClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleAreaClick()
                    }
                }}
                tabIndex={0}
                role="button"
                aria-label="Dosya yükleme alanı. Dosyaları buraya sürükleyip bırakın veya tıklayarak seçin."
            >
                <input {...getInputProps()} ref={fileInputRef} />
                {isDragActive ? (
                    <p>Dosyaları buraya bırakın...</p>
                ) : (
                    <p>Dosyaları yüklemek için buraya sürükleyin veya tıklayın</p>
                )}
                {uploading && (
                    <Progress value={uploadProgress} className="w-full mt-4" />
                )}
            </div>

            <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4' : 'space-y-4'}>
                {filteredFolders.map((folder, index) => (
                    <Card key={index} className={view === 'list' ? 'flex items-center' : ''}>
                        <CardContent className={\`p-4 \${view === 'list' ? 'flex items-center justify-between w-full' : ''}\`}>
                            <div className={\`\${view === 'list' ? 'flex items-center' : ''}\`}>
                                <Folder className={\`mb-2 \${view === 'list' ? 'w-16 h-16 mr-4' : 'w-full h-32'}\`} />
                                <div>
                                    <h3 className="font-semibold">{folder.name}</h3>
                                    <p className="text-sm text-gray-500">Folder</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 mt-2">
                                <Button variant="outline" size="sm" onClick={() => handleOpenFolder(folder)}>
                                    <span className="sr-only">Klasörü aç</span>
                                    Aç
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDelete(folder._id, true)}>
                                    <Trash2 className="w-4 h-4" />
                                    <span className="sr-only">Klasörü sil</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredItems.map((item, index) => (
                    <Card key={index}
                        className={\`\${view === 'list' ? 'flex items-center' : ''} 
                    \${openType === 'select' ? 'hover:shadow-2xl cursor-pointer hover:scale-110 transition-all duration-300' : ''}\`}
                        onClick={() => {
                            if (openType === 'select') {
                                setSelectedImage(item?._id);
                                setIsOpenModal(false);
                            }
                        }}
                    >
                        <CardContent className={\`p-4 \${view === 'list' ? 'flex items-center justify-between w-full' : ''}\`}>
                            <div className={\`\${view === 'list' ? 'flex items-center' : ''}\`}>
                                <img src={\`\${imagePath}/\${item?.name}\`} alt={item.name} className={\`mb-2 rounded-md \${view === 'list' ? 'w-16 h-16 mr-4' : 'w-full h-32 object-cover'}\`} />
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.type}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 mt-2">
                                <MediaManagementImageEdit item={item} />
                                <Button variant="outline" size="sm" onClick={() => handleDelete(item._id, false)}>
                                    <Trash2 className="w-4 h-4" />
                                    <span className="sr-only">Dosyayı sil</span>
                                </Button>
                                <div className='flex items-center justify-end w-full'>
                                    {selectedImage === item._id && <span className="text-primary">
                                        <Check color='green' className="w-4 h-4" />
                                    </span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}`
    },
    {
        path: 'client/components/contentManagement/mediaManagementPanel/MediaManagementImageEdit.js',
        content: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Crop } from "lucide-react";
import { useState } from "react";
const imagePath = process.env.IMAGE_PATH

//import ImageEditor from "@/components/imageEditor/ImageEditor";
import ImageEditor from "yvr-image-editor";


const MediaManagementImageEdit = ({ item }) => {
    const [localFileUrl, setLocalFileUrl] = useState(null);



    const updateMedia = async (file) => {
        console.log('file', file)
        setLocalFileUrl(URL.createObjectURL(file));
    };

    return (
        <div>
            <img src={localFileUrl} alt={item.name} className="" />
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Crop className="w-4 h-4" />
                        <span className="sr-only">
                            Edit Image
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[85vw] min-h-[85vh] overflow-scroll">
                    <DialogHeader>
                        <DialogTitle>
                            Edit Image
                        </DialogTitle>
                    </DialogHeader>
                    <div className="h-[85vh] w-[85vw]">
                        <ImageEditor
                            currentImage={\`\${imagePath}/\${item.name}\`}
                            getFile={(file) => updateMedia(file)}
                            getSizes={(sizes) => console.log('sizes', sizes)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default MediaManagementImageEdit;`
    }
];


export default clientComponents;