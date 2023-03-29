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

   /* useEffect(()=>{
        if(props.autoFocus) {
            setTimeout(() => {
                searchRf?.focus()
            }, 200)
        }
    },[])*/


    return (
        <div>
          <div className={'position-absolute p-4'}>  <i className={'fa fa-search'}></i> </div>
            <input ref={searchRf} className="textfield textfield2"   placeholder="Search for item" defaultValue={searchQuery} onSubmit={() => props?.handleSearch(searchQuery.trim())} onChange={(e)=>{
                onChangeSearch(e)
            }}   name="search" type="text" style={{paddingLeft:40}}/>

            {Boolean(searchQuery?.length) &&  <div className={'position-absolute p-4'} onClick={()=>{
                searchRf.current.value = "";
                setSearchQuery('');
                searchRf.current.focus()
            }} style={{right:0,top:0}}>  <i className={'fa fa-times'}></i> </div>}
        </div>
    );
};

export default Search;
