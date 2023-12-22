import React from "react";
import { useRouter } from "next/router";
import { Button, Empty } from "antd";

interface Props {
}

const ModalEmpty: React.FC<Props> = (props) => {    
  const router = useRouter();
    return (
        <>
            <div className="h-screen flex justify-center items-center">
                <div></div>
                <Empty description={<span>You do not have permission to view this data!</span>}>
                    <Button onClick={() => router.push("/")} type="primary">
                        Go home
                    </Button>
                </Empty>
            </div>
        </>
    );
};

export default ModalEmpty;
