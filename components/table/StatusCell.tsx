import { getColorByStatus } from "../../utils/helpers";


const StatusCell: React.FC<{ status: string }> = ({ status }) => {
  return (
    <div className="w-max">
      <p
        className={`py-1 px-2 font-bold text-xs ${getColorByStatus(
          status
        )}`}
        style={{ borderRadius: "7px" }}
      >
        {status}
      </p>
    </div>
  );
};

export default StatusCell;
