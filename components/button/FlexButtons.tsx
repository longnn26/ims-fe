import React from "react";
import { Button, Tooltip, Flex } from "antd";
import { IoCloudUpload } from "react-icons/io5";
import { IoReloadOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

interface SaveButtonProps {
  isChanged: boolean;
  onSave: () => void;
  onReload: () => void;
}

const FlexButtons: React.FC<SaveButtonProps> = ({
  onSave,
  onReload,
  isChanged,
}) => {
  return (
    <div className="mb-2 h-9 flex justify-end">
      <AnimatePresence>
        {isChanged && (
          <motion.div
            style={{
              width: "70px",
              display: "flex",
              justifyContent: "space-between",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Tooltip title="Save">
              <Button
                type="primary"
                shape="circle"
                icon={<IoCloudUpload />}
                onClick={onSave}
              />
            </Tooltip>
            <Tooltip title="Reload">
              <Button
                type="primary"
                shape="circle"
                icon={<IoReloadOutline />}
                onClick={onReload}
              />
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlexButtons;
