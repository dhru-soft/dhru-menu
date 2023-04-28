import React, {useState} from 'react';
import Select from 'react-select';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const Index = (props:any) => {

    const [selectedOption,setselectedOption] = useState()


    const handleChange = (selectedOption:any) => {
        setselectedOption(selectedOption)
        props.onChange(selectedOption.code)
    };

    return (
        <Select
            value={selectedOption}
            onChange={handleChange}
            options={props.options}

        />
    );

}

export default  Index
