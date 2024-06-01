import { getColorByStatusClass, translateStatusToVnLanguage } from '@utils/helpers';
import React from 'react';

const StatusCell: React.FC<{ status: string }> = ({ status }) => {
  return (
    <div className="w-max">
      <p
        className={`py-1 px-2 font-semibold text-xs ${getColorByStatusClass(
          status
        )}`}
        style={{ borderRadius: "7px" }}
      >
        {translateStatusToVnLanguage(status)}
      </p>
    </div>
  );
};

export default StatusCell;


