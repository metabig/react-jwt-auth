import React, { useState } from 'react';
import { Input } from './input.component';

export const Card = (props) => {

    const [chagas, setChagas] = useState(false)
    const [open_aviability, setOpenAviability] = useState(false)
    const [publication_aviability, setPublicationAviability] = useState(false)
    const [shared, setShared] = useState(false)

    const changeCondition = (input, e) => {
        if (input.custom_function === "chagas_fnc")
            setChagas(e)
        else if (input.custom_function === "open_aviability")
            setOpenAviability(e)
        else if (input.custom_function === "publication_aviability")
            setPublicationAviability(e)
        else if (input.custom_function === "shared_fnc") setShared(e)

    }

    return (
        <section className={(props.first) ? "no-margin card2" : "card2"}>
            <h1>{props.card.title}</h1>
            <section className="inputs-container">
                {
                    props.card.inputs.map((input, i) => {
                        if (input.condition === undefined) {
                            return (
                                <Input input_data={input}
                                    register={props.reg}
                                    key={i}
                                    onPropertyChange={(e) => changeCondition(input, e)}
                                    errors={props.errors}
                                />
                            );

                        } else if ((input.condition === "chagas" && chagas)
                            || (input.condition === "open_aviability" && open_aviability)
                            || (input.condition === "publication_aviability" && publication_aviability)
                            || (input.condition === "shared" && shared)
                        ) {
                            return (
                                <Input input_data={input}
                                    register={props.reg}
                                    key={i}
                                    errors={props.errors}
                                />
                            );
                        }
                        else return (<section key={i}></section>);
                    })
                }
            </section>
        </section>
    );
}