import React, {useEffect, useState} from "react";

import {connect, useDispatch} from "react-redux";
import {clone, getFromSetting} from "../../lib/functions";



const Index = ({itemDetail:  {tags,notes,itemtags,updateProduct}}) => {

    const inittags = getFromSetting('tag')

    const [selectedTag,setSelectedTag] = useState(0);
    let [temptags,setTempTags] = useState(clone(itemtags));


    useEffect(()=>{

        if(Boolean(inittags) && !Boolean(itemtags)) {
            const filtertags = Object.values(inittags).filter((inittag) => {
                return tags?.includes(inittag.taggroupid)
            })
            setTempTags(clone(filtertags));
        }
    },[])


    useEffect(()=>{
       // updateProduct({itemtags:temptags})
    },[temptags])


     return (

        <>
            {Boolean(temptags?.length) && <div className={'mt-5'}>
                <h6>Tags</h6>

                <div className={'border p-3 rounded-3'}>
                {
                    temptags.map((tag, key) => {
                        const {taggroupname} = tag;
                        const selected = (selectedTag === key);
                        {
                            return (
                                <div  key={key}   onClick={() =>  setSelectedTag(key) }><div>{taggroupname}</div></div>
                            )
                        }
                    })
                }


                {
                    temptags?.map((tags, tagid) => {
                        {
                            return (
                                <div key={tagid}  >
                                    {<div className={'d-flex mt-3'}>

                                        {
                                           tags?.taglist.map((tag, key) => {
                                               return (
                                                   <div className={'pe-3'} key={key}>
                                                       <button type="button" className={`btn btn-${tag.selected?'primary':'light'}`} onClick={() => {
                                                           tag.selected = !Boolean(tag?.selected)
                                                           setTempTags(clone(temptags))
                                                       }}>{tag.name+''}</button>
                                                   </div>
                                               )

                                            })
                                        }
                                    </div>}
                                </div>
                            )
                        }
                    })
                }

                </div>

            </div>}


            {/*<div>
               {<InputBox
                    defaultValue={notes}
                    label={'Notes'}
                    autoFocus={false}
                    onChange={(value) => {
                        updateProduct({notes:value})
                    }}
                />}
            </div>*/}


        </>

    )
}




const mapStateToProps = (state) => ({
    itemDetail : state.itemDetail,
})

export default connect(mapStateToProps)(Index);
