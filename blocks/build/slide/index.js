!function(){"use strict";var e=window.wp.blocks,l=window.React,o=window.wp.i18n,t=window.wp.blockEditor,a=window.wp.components;const r=["core/paragraph","core/heading","core/button"],n=[["core/paragraph",{placeholder:"Add a description..."}]];var c=JSON.parse('{"UU":"splash-blocks/slide"}');(0,e.registerBlockType)(c.UU,{edit:function({attributes:e,setAttributes:c,clientId:i}){const{background:s}=e,d=(0,t.useBlockProps)({className:"splash-slider__slide"});return(0,l.createElement)("div",{...d,style:{backgroundColor:"color"===s.type?s.color:void 0,backgroundImage:"image"===s.type&&s.image?.url?`url(${s.image.url})`:void 0}},(0,l.createElement)(t.InspectorControls,null,(0,l.createElement)(a.PanelBody,{title:(0,o.__)("Background Settings","slide"),initialOpen:!0},(0,l.createElement)(a.SelectControl,{label:(0,o.__)("Background Type","slide"),value:s.type,options:[{label:(0,o.__)("Color","slide"),value:"color"},{label:(0,o.__)("Image","slide"),value:"image"}],onChange:e=>{c({background:{...s,type:e}})}}),"color"===s.type?(0,l.createElement)(t.ColorPalette,{value:s.color,onChange:e=>{c({background:{...s,color:e}})}}):(0,l.createElement)(l.Fragment,null,(0,l.createElement)(t.MediaUploadCheck,null,(0,l.createElement)(t.MediaUpload,{onSelect:e=>{c({background:{...s,image:{url:e.url,id:e.id,alt:e.alt}}})},allowedTypes:["image"],render:({open:e})=>(0,l.createElement)(a.Button,{onClick:e},(0,o.__)("Select Image","slide"))}))))),(0,l.createElement)(t.InnerBlocks,{allowedBlocks:r,template:n}))},save:function({attributes:e}){const{background:o}=e,a=t.useBlockProps.save({className:"splash-slider__slide",style:{backgroundColor:"color"===o.type?o.color:void 0,backgroundImage:"image"===o.type&&o.image?.url?`url(${o.image.url})`:void 0}});return(0,l.createElement)("div",{...a},(0,l.createElement)(t.InnerBlocks.Content,null))}})}();