const clientPages = [
    {
        path: 'client/pages/index.js',
        content: `import DashboardLayout from "@/layout/DashboardLayout";

const index = () => {
    return (
        <DashboardLayout>
            Home
        </DashboardLayout>
    );
}

export default index;
`
    },
    {
        path: 'client/pages/collections/index.js',
        content: `import CollectionLayout from "@/layout/CollectionLayout";
import DashboardLayout from "@/layout/DashboardLayout";

const index = () => {
    return (
        <DashboardLayout title="Collections">
            <CollectionLayout>
                index
            </CollectionLayout>
        </DashboardLayout>
    );
}

export default index;
`
    },
    {
        path: 'client/pages/collections/[collectionName]/index.js',
        content: `import FieldList from "@/components/collection/FieldList";
import { Button } from "@/components/ui/button";
import CollectionLayout from "@/layout/CollectionLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import { schemaManager } from "yvr-core/client";
import { useToast } from "@/components/ui/use-toast"

const index = () => {
    const [collection, setCollection] = useState({});
    const router = useRouter();
    const { collectionName } = router.query;

    const { toast } = useToast();

    const getFields = async () => {
        try {
            const schema = await schemaManager.load(collectionName);
            setCollection(schema);
        } catch (error) {
            toast({
                description: error.message,
            });
        }
    }

    useEffect(() => {
        collectionName && getFields();
    }, [collectionName]);

    return (
        <DashboardLayout title={collection?.model?.name} rightComponent={
            <Button onClick={() => router.push(\`/collections/\${collectionName}/add-field\`)}>+Add Field</Button>
        }>
            <CollectionLayout>
                {collection?.model?.name} Collection
                <FieldList fields={collection?.fields} />
            </CollectionLayout>
        </DashboardLayout>
    );
}

export default index;`
    },
    {
        path: 'client/pages/collections/new.js',
        content: `import NewCollection from "@/components/collection/NewCollection";
import CollectionLayout from "@/layout/CollectionLayout";
import DashboardLayout from "@/layout/DashboardLayout";

const index = () => {
    return (
        <DashboardLayout title="New Collection">
            <CollectionLayout>
            <NewCollection />
            </CollectionLayout>
        </DashboardLayout>
    );
}

export default index;
`
    },
    {
        path: 'client/pages/collections/[collectionName]/add-field.js',
        content: `import AddField from "@/components/collection/AddField";
import CollectionLayout from "@/layout/CollectionLayout";
import DashboardLayout from "@/layout/DashboardLayout";

const index = () => {
    return (
        <DashboardLayout>
            <CollectionLayout>
                <AddField componentType="add" />
            </CollectionLayout>
        </DashboardLayout>
    );
}

export default index;`
    },
    {
        path: 'client/pages/collections/[collectionName]/edit-field.js',
        content: `import AddField from "@/components/collection/AddField";
import CollectionLayout from "@/layout/CollectionLayout";
import DashboardLayout from "@/layout/DashboardLayout";

const index = () => {
    return (
        <DashboardLayout>
            <CollectionLayout>
            <AddField componentType="edit" />
            </CollectionLayout>
        </DashboardLayout>
    );
}

export default index;`
    },
    {
        path: 'client/pages/login.js',
        content: `import Login from "components/Login";

const login = () => {
    return (
       <Login />
    );
}

export default login;`
    },
    {
        path: 'client/pages/register.js',
        content: `import Register from "@/components/Register";

const register = () => {
    return (
        <Register />
    );
}

export default register;`
    },
    {
        path: 'client/pages/content-management/index.js',
        content: `import ContentManagementLayout from "@/layout/ContentManagementLayout";
import DashboardLayout from "@/layout/DashboardLayout";

const index = ({ children }) => {
    return (
        <DashboardLayout title={"Content Management"}>
            <ContentManagementLayout>
                {children}
            </ContentManagementLayout>
        </DashboardLayout>
    );
}

export default index;`
    },
    {
        path: 'client/pages/content-management/[collectionName]/index.js',
        content: `import ContentManagementLayout from "@/layout/ContentManagementLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import CollectionList from "@/components/contentManagement/CollectionList";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

const index = () => {
    const router = useRouter();
    const { collectionName } = router.query;
    return (
        <DashboardLayout title={\`Content Management > \${collectionName}\`} rightComponent={
            <Button onClick={() => router.push(\`/content-management/\${collectionName}/new\`)}>New Content</Button>
        }>
            <ContentManagementLayout>
                <CollectionList />
            </ContentManagementLayout>
        </DashboardLayout>
    );
}

export default index;`
    },
    {
        path: 'client/pages/content-management/[collectionName]/new.js',
        content: `import NewContent from "@/components/contentManagement/NewContent";
import ContentManagementLayout from "@/layout/ContentManagementLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";

const index = () => {
    const router = useRouter();
    const { collectionName } = router.query;
    return (
        <DashboardLayout title={\`Content Management > \${collectionName}\`} >
            <ContentManagementLayout>
                <NewContent />
            </ContentManagementLayout>
        </DashboardLayout>
    );
}

export default index;`
    }
];


export default clientPages