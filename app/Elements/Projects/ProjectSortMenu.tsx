import { useEffect, useState } from "react"
import TypeInput from "../TypeInput";
import MoveableMenu from "../MoveableMenu";
import IonIcon from "@reacticons/ionicons";
import React from "react";
import { InputOption } from "../../assets/Types";

export default function projectSortMenu({ position, active, setActive, primary, setPrimary, secondary, setSecondary, options }) {

    const [orderOptions, setOrderOptions] = useState<InputOption[]>([]);

    useEffect(() => {
        mapOptions();
    }, [])

    function mapOptions() {
        let newOptions:InputOption[] = [];

        for (let i = 0; i < options.length; i++) {
            newOptions.push({ value: options[i], label: options[i] });
        }

        setOrderOptions(newOptions);
    }

    return (
        <MoveableMenu x={position.x} y={position.y} isActive={active} setIsActive={setActive} autoHide={false} width={250} height={250}>
            <div className="m2">
                <div className="leftRow">
                    <IonIcon name="layers" size="large" style={{ height: 20 }} />
                    <h3 className="m2" style={{ marginTop: "2vh" }}>SORT OPTIONS</h3>
                </div>
                <label>Primary</label>
                <div className="m2">
                    <div className="hundred">
                        <TypeInput
                            options={orderOptions}
                            onChange={(opt) => setPrimary(opt)}
                            placeholder={primary}
                        />
                    </div>
                </div>
                <label>Secondary</label>
                <div className="m2">
                    <div className="hundred">
                        <TypeInput
                            options={orderOptions}
                            onChange={(opt) => setSecondary(opt)}
                            placeholder={secondary}
                        />
                    </div>
                </div>
            </div>
        </MoveableMenu>
    )
}