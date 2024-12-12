import * as React from 'react';
import {useEffect, useRef} from 'react';


const Search = (props: any) => {

    const [searchQuery, setSearchQuery] = React.useState('');
    const searchRf:any= useRef<any>(null)


    const onChangeSearch = (event: any) => {
        setSearchQuery(event.target.value)
    };



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
                searchRf.current.focus()
            }, 500)
        }
    },[])


    return (
        <div>
          <div className={'position-absolute'} style={{padding:12}}>  <i className={'fa fa-search'}></i> </div>
            <input  ref={searchRf}  className="textfield textfield2 bg-light"    placeholder={props.placeholder || 'Search'} defaultValue={searchQuery} onSubmit={() => props?.handleSearch(searchQuery.trim())} onChange={(e)=>{
                onChangeSearch(e)
            }}    name="search" type="text" style={{paddingLeft:35,borderRadius:12,height:40}} role="presentation" autoFocus={true} autoComplete="off"/>

            {Boolean(searchQuery?.length) &&  <div className={'position-absolute p-4'} onClick={()=>{
                searchRf.current.value = "";
                setSearchQuery('');
                searchRf.current.focus()
            }} style={{right:0,top:0}}>  <i className={'fa fa-times'}></i> </div>}
        </div>
    );
};

export default Search;
