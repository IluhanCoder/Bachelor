import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";

interface LocalParams {
    startDate: Date,
    endDate: Date
    handleStart: (date: Date) => void,
    handleEnd: (date: Date) => void,
    className?: string
}

function DatePicker ({handleStart, startDate, endDate, handleEnd, className}: LocalParams) {
    return <div className={className}>
          <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  <span>Початок</span>
              </label>
              <div className="relative">
                <ReactDatePicker
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 pl-10 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm hover:border-green-300"
                  selected={startDate}
                  onChange={handleStart}
                  locale={"ua"}
                  minDate={new Date()}
                  placeholderText="Виберіть дату початку..."
                  calendarClassName="custom-calendar"
                  wrapperClassName="w-full"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 text-lg">🗓️</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-xl">🏁</span>
                  <span>Завершення</span>
              </label>
              <div className="relative">
                <ReactDatePicker
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 pl-10 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                  selected={endDate}
                  onChange={handleEnd}
                  locale={"ua"}
                  minDate={startDate}
                  placeholderText="Виберіть дату завершення..."
                  calendarClassName="custom-calendar"
                  wrapperClassName="w-full"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600 text-lg">📍</span>
              </div>
            </div>
    </div>
}

export default DatePicker;