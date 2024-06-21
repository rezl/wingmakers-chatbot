"use client"

import { usePathname, useRouter } from "next/navigation";
import { FiChevronRight } from "react-icons/fi"; // import your desired icon

export default function BreadCrumb() {
    const pathName = usePathname();
    const router = useRouter();

    // Remove the first slash and split the path
    const pathSegments = pathName.slice(1).split('/');

    // Create paths for each breadcrumb segment
    const createPath = (index:any) => {
        return '/' + pathSegments.slice(0, index + 1).join('/');
    };

    return (
        <div className="w-full pb-2 border-b flex items-center mb-2">
            {pathSegments.map((segment, index) => (
                <span key={index} className="flex items-center text-muted-foreground text-sm font-medium">
                    <a
                        href={createPath(index)}
                        onClick={(e) => {
                            e.preventDefault();
                            router.push(createPath(index));
                        }}
                        className="hover:text-foreground "
                    >
                        {segment}
                    </a>
                    {index < pathSegments.length - 1 && (
                        <FiChevronRight className="mx-2" />
                    )}
                </span>
            ))}
        </div>
    );
}
