import React, {useEffect, useState} from "react";
import { Card, Col, Row, Divider } from "antd";

interface Props {
    staffRole: string[] | undefined;
}
const StaffRole: React.FC<Props> = (props) => {
    const { staffRole } = props;

    const getCardTitle = (role: string) => {
        if (role?.includes("Sale")) {
            return "Sales Staff";
        } else if (role?.includes("Tech")) {
            return "Technical Staff";
        } else if (role?.includes("Admin")) {
            return "Administrator";
        }
    };

    const getCardContent = (role: string | undefined) => {
        switch (role) {
          case "Sales Staff":
            return "Allows permissions:...";
          case "Technical Staff":
            return "Allows permissions:...";
          case "Administrator":
            return <span>Allows permissions: <br />
                         &nbsp;&nbsp;&nbsp;- Manage staff accounts</span>
        }
      };
    
    const renderCards = () => {
        if (staffRole && staffRole.length > 0) {
            return staffRole.slice(0, 3).map((role, index) => (
                <Col span={8} key={index}>
                    <Card title={getCardTitle(role)} bordered={true}>
                    {getCardContent(getCardTitle(role))}
                    </Card>
                </Col>
            ));
        } else {
            return (
                <Col span={24}>
                    <Card title="No Roles" bordered={false}>
                        No positions assigned.
                    </Card>
                </Col>
            );
        }
    };

    return (
        <div className="m-5 rounded-md">
            <Divider orientation="left" plain>
        <h3>Staff Position</h3>
      </Divider>
            <Row gutter={16}>{renderCards()}</Row>
        </div>
    );
};

export default StaffRole;