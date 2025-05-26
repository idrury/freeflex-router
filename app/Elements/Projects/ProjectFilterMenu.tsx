import { useEffect, useState } from "react";
import TypeInput from "../TypeInput";
import MoveableMenu from "../MoveableMenu";
import IonIcon from "@reacticons/ionicons";
import AddDateModal from "../AddDateModal";
import { DateTime, Duration, Interval } from "luxon";
import { formatDatestring } from "../../Functions/Dates";
import React from "react";
import {
  PRIORITY_SELECT_OPTIONS,
  STATUS_SELECT_OPTIONS,
} from "./DATA";
import { FFProject, InputOption } from "../../assets/Types";
import { get } from "http";

interface ProjectFilterMenuProps {
  filter;
  setFilter: (val) => void;
  options: any[];
  projects: FFProject[];
}

export default function ProjectFilterMenu({
  filter,
  setFilter,
  options,
  projects,
}: ProjectFilterMenuProps) {
  const [filterOptions, setFilterOptions] = useState<{
    category: string;
    value: string | null;
  }>(filter);
  const [orderOptions, setOrderOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    mapOptions();
  }, []);

  function mapOptions() {
    let newOptions = new Array<InputOption>();

    newOptions.push({ value: "name", label: "Project name" });
    for (let i = 0; i < options.length; i++) {
      newOptions.push({
        value: options[i],
        label: `${options[i][0].toUpperCase()}${(
          options[i] as string
        ).slice(1)}`,
      });
    }

    setOrderOptions(newOptions);
  }

  function submitForm(form) {
    form.preventDefault();
    setFilter(filterOptions);
  }

  /***************************************
   * Query the project list based on the given field and val
   * @param field The category to filter by
   * @param val The value of the category to search for
   */
  function updateFilterOptions(field, val) {
    if (field == "cat") {
      setFilter({ category: null, value: null });
      setFilterOptions({ category: val, value: null });
    } else if (field == "val") {
      let updatedFilterOptions = {
        category: filterOptions.category,
        value: val,
      };
      setFilterOptions(updatedFilterOptions);
      setFilter(updatedFilterOptions);
    }
  }

  return (
    <div className="centerRow">
      <form onSubmit={submitForm}>
        <div className="w100">
          <div className="leftRow middle p0 pl2 boxed">
            <IonIcon
              name={`${filter.value ? "funnel" : "funnel-outline"}`}
              className="basicIcon mr2"
              style={{
                color: `${
                  filter.value ? "var(--primaryColor" : "var(--text"
                }`,
              }}
            />

            <div className="">
              <TypeInput
                options={orderOptions}
                onChange={(cat) => updateFilterOptions("cat", cat)}
                placeholder={"Project name"}
              />
            </div>

            <div className="ml2">
              <div className="hundred">
                <ValueSelector
                  projects={projects}
                  category={filterOptions.category}
                  statusOptions={STATUS_SELECT_OPTIONS}
                  priorityOptions={PRIORITY_SELECT_OPTIONS}
                  onChange={(val) => updateFilterOptions("val", val)}
                  value={filterOptions.value || ""}
                />
              </div>
            </div>
            {filterOptions.value && (
              <IonIcon
                onClick={() => updateFilterOptions("val", null)}
                className="buttonIcon middle dangerButton ml2 mr2"
                name="close"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

type ValueSelectorProps = {
  category: string;
  statusOptions: InputOption[];
  priorityOptions: InputOption[];
  value: string | null;
  onChange: (val) => void;
  projects: FFProject[];
};

/*************************************************************************
 *************************************************************************
 * Control the available values for the filter menu based on the category
 */
function ValueSelector({
  category,
  statusOptions,
  priorityOptions,
  value,
  onChange,
  projects,
}: ValueSelectorProps) {
  const [date1, setDate1] = useState<DateTime>(DateTime.now());
  const [date2, setDate2] = useState<DateTime>(
    DateTime.now().plus(Duration.fromObject({ week: 1 }))
  );

  useEffect(() => {
    if (!value) {
      setDate1(DateTime.now());
      setDate2(DateTime.now().plus(Duration.fromObject({ week: 1 })));
    }
  }, [value]);

  function updateDateDuration(dateNum: number, date: Date) {
    let interval: Interval | undefined = undefined;
    let dateObj = DateTime.fromJSDate(date);

    if (dateNum == 0) {
      setDate1(dateObj);
      interval = Interval.fromDateTimes(
        dateObj.set({ hour: 0, minute: 0, second: 0 }),
        date2
      );
    } else if (dateNum == 1) {
      setDate2(dateObj);
      interval = Interval.fromDateTimes(
        date1.set({ hour: 0, minute: 0, second: 0 }),
        dateObj
      );
    }

    if (interval?.isValid) {
      onChange(interval);
    }
  }

  if (category == "status") {
    return (
      <TypeInput
        options={statusOptions}
        onChange={onChange}
        placeholder="none"
      />
    );
  } else if (category == "name") {
    return (
      <div className="pr3">
        <input
          className="m0"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="none"
        />
      </div>
    );
  } else if (category == "priority") {
    return (
      <TypeInput
        options={priorityOptions}
        onChange={onChange}
        placeholder="none"
      />
    );
  } else if (
    category == "delivery date" ||
    category == "start date"
  ) {
    return (
      <div className="leftRow m0 middle">
        <AddDateModal
          date={date1.toJSDate()}
          setDate={(val) => updateDateDuration(0, val)}
          label={formatDatestring(date1)}
        />
        <p>-</p>
        <AddDateModal
          date={date2.toJSDate()}
          setDate={(val) => updateDateDuration(1, val)}
          label={formatDatestring(date2)}
        />
      </div>
    );
  }
}
