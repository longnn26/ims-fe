import React from "react";
import { useRouter } from "next/router";
import { Button, Empty } from "antd";

interface Props {
    isPermission: boolean;
    content: string;
}

const ModalEmpty: React.FC<Props> = (props) => {
    const { isPermission, content } = props;
    const router = useRouter();

    var display = "";
    if (isPermission) {
        display = "You do not have permission to view this data";
    } else {
        display = content;
    }
    console.log(isPermission)
    return (
        <>
            <div className="h-screen flex justify-center items-center">
                <div></div>
                <Empty description={<span>{display}!</span>}>
                    <Button onClick={() => router.push("/")} type="primary">
                        Go Home
                    </Button>
                </Empty>
            </div>
        </>
    );
};

export default ModalEmpty;
