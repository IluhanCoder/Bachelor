import ReactDatePicker from "react-datepicker";
import { inputStyle } from "../styles/form-styles";

interface LocalParams {
    startDate: Date,
    endDate: Date
    handleStart: (date: Date) => void,
    handleEnd: (date: Date) => void
}

function DatePicker ({handleStart, startDate, endDate, handleEnd}: LocalParams) {
    return <div>
        <div className="flex gap-2">
              <label>Від:</label>
              <ReactDatePicker
                dateFormat="dd/MM/yyyy"
                className={inputStyle}
                selected={startDate}
                onChange={handleStart}
                locale={"ua"}
              />
            </div>
            <div className="flex gap-2">
              <label>До:</label>
              <ReactDatePicker
                dateFormat="dd/MM/yyyy"
                className={inputStyle}
                selected={endDate}
                onChange={handleEnd}
                locale={"ua"}
              />
            </div>
    </div>
}

export default DatePicker;