import * as React from 'react';
import {useEffect, useRef} from 'react';


const Search = (props: any) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (event: any) => {
        setSearchQuery(event.target.value)
    };
    let searchRf:any = useRef()

    useEffect(() => {

        if (Boolean(searchQuery)) {
            const delayDebounceFn = setTimeout(() => {
                !props?.disableKeypress && props?.handleSearch(searchQuery);
            }, props.timeout ? props.timeout : 500)
            return () => clearTimeout(delayDebounceFn)
        } else {
            !props?.disabledefaultload && props?.handleSearch(searchQuery)
        }

    }, [searchQuery]);

    useEffect(()=>{
        if(props.autoFocus) {
            setTimeout(() => {
                searchRf?.focus()
            }, 200)
        }
    },[])


    return (
        <div>

            <input className="textfield textfield--grey" placeholder="Search" defaultValue={searchQuery} onSubmit={() => props?.handleSearch(searchQuery.trim())} onChange={(e)=>{
                onChangeSearch(e)
            }}  name="search" type="text" style={{borderRadius:5}}/>

        </div>
    );
};

export default Search;