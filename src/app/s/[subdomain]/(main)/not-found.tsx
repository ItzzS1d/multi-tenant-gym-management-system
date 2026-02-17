import NotFound from "@/shared/components/404";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { constructUrl } from "@/shared/lib/utils";

const NotFounPage = async () => {
    return (
        <main>
            <SidebarProvider>
                <NotFound
                    mode="tenant"
                    url={constructUrl("/dashboard", "subdomain")}
                />
            </SidebarProvider>
        </main>
    );
};

export default NotFounPage;
