import type { SetStateAction } from 'react';
import BasicMenu from './BasicMenu'

interface ErrorPopupProps {
     active: boolean, 
     setActive: (value: boolean) => SetStateAction<any>, 
     headerText: string | undefined, 
     text: string, 
     hideOops: boolean
}

export default function ErrorPopup({ active, setActive, headerText=undefined, text, hideOops = false }:ErrorPopupProps) {

    let editedText = [text];

    if (text) {
        editedText = text.split('\n');
    }

        return (
            <BasicMenu isActive={active} setIsActive={setActive} width={400}>
                <div>
                    {!hideOops && <h2>Oops!</h2>}
                    {headerText && <h3 className='m2'>{headerText}</h3>}
                    <div className='m2'>
                        {editedText.map((line, i) => (
                            <p className='m0 textCenter' key={i}>{line}</p>
                        ))}
                    </div>
                    <div className='hundred center'>
                        <button className='dangerButton hundred' onClick={() => setActive(false)}>Dismiss</button>
                    </div>
                </div>
            </BasicMenu>
        )
}