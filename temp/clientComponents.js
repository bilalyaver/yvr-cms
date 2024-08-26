const clientComponents = [
    {
        path: 'client/components/collection/NewCollection.js',
        content: `import { schemaManager } from "yvr-core/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
import { toast } from "../ui/use-toast";
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
        path: 'client/components/collection/AddField.js',
        content: `import { useState, useEffect } from "react"
import { schemaManager } from "yvr-core/client";
import { useRouter } from "next/router"
import { toast } from "../ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const AddField = ({ }) => {
    const [schemas, setSchemas] = useState([]);
    const [model, setModel] = useState({});
    const [fields, setFields] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [required, setRequired] = useState(false);
    const [unique, setUnique] = useState(false);
    const [defaultValue, setDefaultValue] = useState("");
    const [referenceSchema, setReferenceSchema] = useState("");
    const router = useRouter();
    const { collectionName, fieldName } = router.query;

    useEffect(() => {
        if (fields && fieldName) {
            const foundField = fields?.find(f => f.name == fieldName);
            setName(foundField?.name);
            setType(foundField?.type);
            setRequired(foundField?.required);
            setUnique(foundField?.unique);
            setDefaultValue(foundField?.defaultValue);
        }
    }, [fields, fieldName]);

    const handleSubmit = async (e) => {
        if (!name || !type) {
            toast({
                description: "Please fill all the fields",
            })
            return;
        }

        let newFields;

        if (fieldName) {
            newFields = fields.map(f => {
                if (f.name == fieldName) {
                    return {
                        name,
                        type,
                        required,
                        unique,
                        defaultValue
                    }
                }
                return f;
            });
        } else {
            newFields = [...fields, {
                name,
                type,
                required,
                unique,
                defaultValue
            }];
        }

        try {
            const data = await schemaManager.update(model, newFields);
            toast({
                description: "Field added successfully",
                type: "success"
            })
            router.push(\`/collections/\${collectionName}\`);
        } catch (error) {
            toast({
                description: error.message,
            })
        }
    };

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
        type == "ObjectId" && getSchemas();
    }, [type]);

    console.log(schemas);


    return (
        <div className="flex flex-col gap-y-3">
            {fieldName ?
                <h1 className="text-2xl font-semibold">
                    Edit Field: {fieldName}
                </h1>
                :
                <h1 className="text-2xl font-semibold">
                    Add Field to {model?.name} Collection
                </h1>
            }
            <form className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">

                    <div className="grid gap-2">
                        <Label htmlFor="field-name">Field Name</Label>
                        <Input
                            value={name || ""}
                            onChange={(e) => setName(e.target.value)}
                            id="field-name" placeholder="Enter field name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="field-type">Field Type</Label>
                        <Select
                            onValueChange={(e) => setType(e)}
                            value={type}
                            id="field-type">
                            <SelectTrigger>
                                <SelectValue placeholder="Select field type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="String">String</SelectItem>
                                <SelectItem value="Number">Number</SelectItem>
                                <SelectItem value="Boolean">Boolean</SelectItem>
                                <SelectItem value="Date">Date</SelectItem>
                                <SelectItem value="Object">Object</SelectItem>
                                <SelectItem value="Array">Array</SelectItem>
                                <SelectItem value="ObjectId">ObjectId</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="required">Required</Label>
                            <Checkbox
                                checked={required}
                                onCheckedChange={(e) => setRequired(e)}
                                id="required" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="unique">Unique</Label>
                            <Checkbox
                                checked={unique}
                                onCheckedChange={(e) => setUnique(e)}
                                id="unique" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="default-value">Default Value</Label>
                            <Input
                                value={defaultValue}
                                onChange={(e) => setDefaultValue(e.target.value)}
                                id="default-value" placeholder="Enter default value" />
                        </div>
                    </div>
                </div>
                {
                    type == "ObjectId" &&
                    <div className="grid gap-2">
                        <Label htmlFor="field-reference-schema">
                            Reference Schema
                        </Label>
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
                }
            </form>
            <div className="flex justify-end  gap-2">
                <Button
                    onClick={() => setField({
                        name: "",
                        type: "",
                        required: false,
                        unique: false,
                        defaultValue: ""
                    })}
                    variant="outline">Reset</Button>
                <Button
                    onClick={handleSubmit}
                    variant="primary"
                >Submit</Button>
            </div>
        </div>
    );
}

export default AddField;`
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

const FieldList = ({ fields }) => {
    const router = useRouter();
    const { collectionName } = router.query;

    return (
        <div>
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
                    {fields?.map((field, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{field.name}</TableCell>
                            <TableCell>{field.type}</TableCell>
                            <TableCell>{field.defaultValue}</TableCell>
                            <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                            <TableCell>{field.unique ? "Yes" : "No"}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => router.push(\`/collections/\${collectionName}/edit-field?fieldName=\${field?.name}\`)}>
                                        <EditIcon className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon">
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
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/router"
import { setCookie } from 'cookies-next';
import { api } from "yvr-core/client";


const apiBaseUrl = process.env.API_BASE_URL;

export default function Login() {
    const [email, setEmail] = useState("bilal@thejs.app");
    const [password, setPassword] = useState("123456");

    const { toast } = useToast();

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
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/router"
import { setCookie } from 'cookies-next';
import { api } from "yvr-core/client";


const apiBaseUrl = process.env.API_BASE_URL;

export default function Register() {
    const [name, setName] = useState("Bilal Yaver");
    const [email, setEmail] = useState("bilal@thejs.app");
    const [password, setPassword] = useState("123456");

    const { toast } = useToast();

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
import { api } from 'yvr-core/client';
import ContentManagementTable from './ContentManagementTable';

const CollectionList = () => {
    const [list, setList] = useState([]);
    const [count, setCount] = useState(0);
    

    const router = useRouter();
    const { collectionName } = router.query;

    const getList = async () => {
        const {list, count} = await api.get(\`/\${collectionName}:getAll\`);
        setList(list);
        setCount(count);
    }

    useEffect(() => {
        collectionName && getList();
    }, [collectionName]);

    return (
        <div>
            {list?.length > 0 && <ContentManagementTable list={list} count={count} collectionName={collectionName} />}
        </div>
    );
}

export default CollectionList;`
    },
    {
        path: 'client/components/contentManagement/ContentManagementTable.js',
        content: `"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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

// Varsayılan kolonlar
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
                            onClick={() => navigator.clipboard.writeText(item._id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]

export default function ContentManagementTable({ list }) {
    const [columns, setColumns] = useState([]);
    const [filterColumn, setFilterColumn] = useState("");

    const router = useRouter();
    const { collectionName } = router.query;

    const getSchema = async () => {
        try {
            let { fields } = await schemaManager.load(collectionName);

            fields = fields.filter(field => field.name !== 'password'); // Şifre alanını çıkartıyoruz

            // Dinamik sütunlar
            const tempColumns = [
                columnsDefault[0], 
                ...fields.map(field => ({
                    accessorKey: field.name,
                    header: field.name.charAt(0).toUpperCase() + field.name.slice(1),
                    cell: ({ row }) => <div>{row.getValue(field.name)}</div>,
                })), 
                columnsDefault[columnsDefault.length - 1]
            ];

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
                    value={(table.getColumn(filterColumn)?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filterColumn)?.setFilterValue(event.target.value)
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
import { Input } from "@/components/ui/input"; // Varsayılan input bileşeni
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { api } from 'yvr-core/client';

const NewContent = () => {
    const [schema, setSchema] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Default olarak 'user' değeri seçili olacak
    });
    
    const router = useRouter();
    const { collectionName } = router.query;

    const getSchema = async () => {
        const schema = await schemaManager.load(collectionName);
        setSchema(schema);
    }

    useEffect(() => {
        collectionName && getSchema();
    }, [collectionName]);

    console.log(schema);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await api.post(\`/\${collectionName}:create\`, formData);
        console.log(data);
    };

    return (
        <div>
            <h1>
                New Content
            </h1>
            <div>
            <form onSubmit={handleSubmit} className="space-y-4">
            {schema?.fields?.map((field) => {
                if (field.type === "String" && !field.enum) {
                    return (
                        <div key={field.name} className="grid gap-2">
                            <Label htmlFor={field.name}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                required={field.required}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={\`Enter \${field.name}\`}
                            />
                        </div>
                    );
                }

                if (field.enum && field.type === "String") {
                    return (
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
                    );
                }

                return null; // Eğer tanımlı olmayan bir type varsa
            })}
            <Button type="submit">Submit</Button>
        </form>
            </div>
        </div>
    );
}

export default NewContent;`
    }
];


export default clientComponents;