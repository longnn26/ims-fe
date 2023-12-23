import React from "react";
import { useRouter } from "next/router";
import { Button, Empty } from "antd";

interface Props {
    isPermission: boolean;
}

const ModalEmpty: React.FC<Props> = (props) => {
    const { isPermission } = props;
    const router = useRouter();

    var content = "";
    if (isPermission) {
        content = "You do not have permission to view this data!";
    } else {
        content = "This data is not exist!";
    }
    return (
        <>
            <div className="h-screen flex justify-center items-center">
                <div></div>
                <Empty description={<span>`${content}</span>}>
                    <Button onClick={() => router.push("/")} type="primary">
                        Go home
                    </Button>
                </Empty>
            </div>
        </>
    );
};

export default ModalEmpty;
