import { Button, Form, Input, Label } from "@heroui/react";
import { Search } from "lucide-react";
import HKModal from "./HKModal";
import { useNavigate } from "react-router";

export default function () {
    const navigate = useNavigate();

    function search(formData: FormData) {
        navigate("/search", {
            state: {
                search: formData.get("search")
            }
        });
    }

    return <HKModal btn={<Button variant="primary"><Search size={40} />搜索</Button>}>
        <Form action={search}>
            <div className="flex items-center mb-2">
                <Label className="text-2xl">搜索韩剧</Label>
            </div>
            <Input className="w-full bg-field-hover" name="search" required placeholder="输入片名" />
            <div className="mt-3 text-right">
                <Button variant="primary" type="submit">
                    <Search size={40} />
                    搜索
                </Button>
            </div>
        </Form>
    </HKModal>
}