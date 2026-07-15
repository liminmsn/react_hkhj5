import { Modal } from "@heroui/react";
import type { ReactNode } from "react";

type HKModelType = {
    btn: ReactNode;
    head?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
}

export default function ({ btn, children, head, footer }: HKModelType) {
    return <Modal>
        {btn}
        {/* <Button variant="secondary">打开模态框</Button> */}
        <Modal.Backdrop>
            <Modal.Container>
                <Modal.Dialog>
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        {head}
                        {/* <Modal.Icon className="bg-default text-foreground">
                            <Rocket className="size-5" />
                        </Modal.Icon>
                        <Modal.Heading>欢迎使用 HeroUI</Modal.Heading> */}
                    </Modal.Header>
                    <Modal.Body>
                        {children}
                        {/* <p>一套美观、快速、现代的 React UI 库，可轻松构建无障碍且高度可定制的 Web 应用。</p> */}
                    </Modal.Body>
                    <Modal.Footer>
                        {footer}
                        {/* <Button className="w-full" slot="close">
                            继续
                        </Button> */}
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>
}