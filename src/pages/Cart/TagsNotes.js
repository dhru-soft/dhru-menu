import React, {useEffect, useState} from "react";
import {Caption, Chip, Paragraph, Text, withTheme} from "react-native-paper";

import {connect, useDispatch} from "react-redux";
import {TouchableOpacity, div} from "react-native";

import {appLog, clone, findObject} from "../../lib/functions";



const Index = ({itemDetail,itemDetail: {tags:{inittags}, notes, itemtags}}) => {

    console.log('itemDetail',itemDetail)

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
            {Boolean(temptags?.length) && <div>
                <h6>Tags</h6>

                <div>
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
                </div>

                {
                    temptags?.map((tags, tagid) => {
                        {
                            return (
                                <div key={tagid}  >
                                    {<div>
                                        <div>{tag.name+''}</div>
                                        {/*{
                                           tags?.taglist.map((tag, key) => {
                                                return (<Chip key={key} style={[tag.selected?styles.bg_light_blue:styles.light.color,styles.m_2,styles.p_3]}     icon={tag.selected?'check':'stop'} onPress={() => {
                                                    tag.selected = !Boolean(tag?.selected)
                                                    setTempTags(clone(temptags))
                                                }}><div style={[styles.p_5]}>{tag.name+''}</div></Chip>)
                                            })
                                        }*/}
                                    </div>}
                                </div>
                            )
                        }
                    })
                }

            </div>}


            <div>
                {/*<InputBox
                    defaultValue={notes}
                    label={'Notes'}
                    autoFocus={false}
                    onChange={(value) => {
                        updateProduct({notes:value})
                    }}
                />*/}
            </div>


        </>

    )
}




const mapStateToProps = (state) => ({
    itemDetail : state.itemDetail,
})

export default connect(mapStateToProps)(withTheme(Index));
