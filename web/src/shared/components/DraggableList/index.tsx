import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
// import TweenOne from 'rc-tween-one';
// import QueueAnim from 'rc-queue-anim';
//
// function toArrayChildren(children: any) {
//   const ret: any = [];
//   React.Children.forEach(children, c => {
//     ret.push(c);
//   });
//   return ret;
// }
//
// function findChildInChildrenByKey(children: any, key: any) {
//   let ret: any = null;
//   if (children) {
//     children.forEach((c: any) => {
//       if (ret || !c) {
//         return;
//       }
//       if (c.key === key) {
//         ret = c;
//       }
//     });
//   }
//   return ret;
// }
//
// function mergeChildren(prev: any, next: any) {
//   const ret: any = [];
//   // 保存更改后的顺序，新增的在新增时的位置插入。
//   prev.forEach((c: any) => {
//     if (!c) {
//       return;
//     }
//     const newChild = findChildInChildrenByKey(next, c.key);
//     if (newChild) {
//       ret.push(newChild);
//     }
//   });
//
//   next.forEach((c: any, i: any) => {
//     if (!c) {
//       return;
//     }
//     const newChild = findChildInChildrenByKey(prev, c.key);
//     if (!newChild) {
//       ret.splice(i, 0, c);
//     }
//   });
//   return ret;
// }
// // static propTypes = {
// //     component: PropTypes.any,
// //     animType: PropTypes.string,
// //     onChange: PropTypes.any,
// //     dragClassName: PropTypes.string,
// //     appearAnim: PropTypes.object,
// //     onEventChange: PropTypes.any,
// // };
// type TProps = {
//   onChange: () => any;
//   onEventChange: () => any;
//   children: any;
// };
// export const ListSort = (props: TProps) => {
//   const component = 'div';
//   const animType = 'y';
//   const dragClassName = null;
//   const appearAnim = null;
//
//   const [index, setIndex] = useState(null);
//   const [swapIndex, setSwapIndex] = useState(null);
//   const [mouseXY, setMouseXY] = useState(null);
//   const [isDrage, setIsDrage] = useState(false);
//   const [dom, setDom] = useState(null);
//
//   const [children, setChildren] = useState(props.children);
//   const [style, setStyle] = useState({});
//   const [childStyle, setChildStyle] = useState([]);
//   const [animation, setAnimation] = useState([]);
//
//   const onMouseDown = (i, e) => {
//       if (isDrage) {
//           return;
//       }
//       const rect = dom.getBoundingClientRect();
//       document.body.style.overflow = 'hidden';
//       props.onEventChange(e, 'down');
//       setStyle({
//           height: `${rect.height}px`,
//           userSelect: 'none',
//           WebkitUserSelect: 'none',
//           MozUserSelect: 'none',
//           MsUserSelect: 'none'
//       })
//       setChildren(Array.prototype.slice.call(dom.children) );
//       setChildStyle([]);
//       const newChildStyle = children.map((item, ii) => {
//           const cItem = children[ii + 1];
//           let marginHeight;
//           let marginWidth;
//           if (cItem) {
//               marginHeight = cItem.offsetTop - item.offsetTop - item.clientHeight;
//               marginWidth = cItem.offsetLeft - item.offsetLeft - item.clientWidth;
//           } else {
//               const parentHeight =
//                   item.parentNode.clientHeight -
//                   parseFloat(getComputedStyle(item.parentNode).getPropertyValue('padding-bottom'));
//               const parentWidth =
//                   item.parentNode.clientWidth -
//                   parseFloat(getComputedStyle(item.parentNode).getPropertyValue('padding-right'));
//               marginHeight = parentHeight - item.offsetTop - item.clientHeight;
//               marginWidth = parentWidth - item.offsetLeft - item.clientWidth;
//           }
//           const d = {
//               width: item.clientWidth,
//               height: item.clientHeight,
//               top: item.offsetTop,
//               left: item.offsetLeft,
//               margin: 'auto',
//               marginHeight,
//               marginWidth,
//               position: 'absolute',
//               zIndex: ii === i ? 1 : 0
//           };
//           setChildStyle( style => style.push({ ...d }))
//           return d;
//       });
//       setAnimation(children.map(
//           (item, ii) =>
//               (i === ii && { scale: 1.2, boxShadow: '0 10px 10px rgba(0,0,0,0.15)' }
//       ));
//       setIndex(i);
//       setSwapIndex(i);
//       setMouseXY({
//           startX: e.touches === undefined ? e.clientX : e.touches[0].clientX,
//           startY: e.touches === undefined ? e.clientY : e.touches[0].clientY,
//           top: newChildStyle[i].top,
//           left: newChildStyle[i].left
//       });
//       setIsDrage(true))
//       setChildStyle(newChildStyle);
//   };
// };
// export default class ListSort extends React.Component {
//   componentDidMount() {
//     this.dom = ReactDOM.findDOMNode(this);
//
//     if (window.addEventListener) {
//       window.addEventListener('mousemove', this.onMouseMove);
//       window.addEventListener('touchmove', this.onMouseMove);
//       window.addEventListener('mouseup', this.onMouseUp);
//       window.addEventListener('touchend', this.onMouseUp);
//     } else {
//       window.attachEvent('onmousemove', this.onMouseMove);
//       window.attachEvent('ontouchmove', this.onMouseMove);
//       window.attachEvent('onmouseup', this.onMouseUp);
//       window.attachEvent('ontouchend', this.onMouseUp);
//     }
//   }
//
//   componentWillReceiveProps(nextProps) {
//     const currentChildren = this.state.children;
//     const nextChildren = nextProps.children;
//     const newChildren = mergeChildren(currentChildren, nextChildren);
//     this.setState({ children: newChildren });
//   }
//
//   componentWillUnmount() {
//     if (window.addEventListener) {
//       window.removeEventListener('mousemove', this.onMouseMove);
//       window.removeEventListener('touchmove', this.onMouseMove);
//       window.removeEventListener('mouseup', this.onMouseUp);
//       window.removeEventListener('touchend', this.onMouseUp);
//     } else {
//       window.detachEvent('onmousemove', this.onMouseMove);
//       window.detachEvent('ontouchmove', this.onMouseMove);
//       window.detachEvent('onmouseup', this.onMouseUp);
//       window.detachEvent('ontouchend', this.onMouseUp);
//     }
//   }
//
//
//
//   onMouseUp = e => {
//     if (!this.mouseXY) {
//       return;
//     }
//     this.mouseXY = null;
//     document.body.style.overflow = null;
//     this.props.onEventChange(e, 'up');
//     const animation = this.state.animation.map((item, i) => {
//       if (this.index === i) {
//         const animate = {};
//         let height = 0;
//         if (this.props.animType === 'y') {
//           if (this.swapIndex > this.index) {
//             const start = this.index + 1;
//             const end = this.swapIndex + 1;
//             this.childStyle.slice(start, end).forEach(_item => {
//               height += _item.height + _item.marginHeight;
//             });
//             animate.top = height + this.childStyle[this.index].top;
//           } else {
//             animate.top = this.childStyle[this.swapIndex].top;
//           }
//         }
//         const dragScale = !this.props.dragClassName && {
//           scale: 1,
//           boxShadow: '0 0px 0px rgba(0,0,0,0)'
//         };
//         return {
//           ...dragScale,
//           ...animate,
//           onComplete: () => {
//             const children = this.sortArray(this.state.children, this.swapIndex, this.index);
//             const callbackBool = this.index !== this.swapIndex;
//             this.index = null;
//             this.childStyle = [];
//             this.swapIndex = null;
//             this.setState(
//               {
//                 style: {},
//                 childStyle: [],
//                 children,
//                 animation: []
//               },
//               () => {
//                 this.isDrage = false;
//                 if (callbackBool) {
//                   this.props.onChange(children);
//                 }
//               }
//             );
//           }
//         };
//       }
//       return item;
//     });
//     if (this.props.dragClassName) {
//       this.listDom.className = `${this.listDom.className
//         .replace(this.props.dragClassName, '')
//         .trim()}`;
//     }
//     this.setState({ animation });
//   };
//
//   onMouseMove = e => {
//     if (!this.mouseXY) {
//       return;
//     }
//     this.mouseXY.x = e.touches === undefined ? e.clientX : e.touches[0].clientX;
//     this.mouseXY.y = e.touches === undefined ? e.clientY : e.touches[0].clientY;
//     const childStyle = this.state.childStyle;
//     let animation = this.state.animation;
//
//     if (this.props.animType === 'x') {
//       // 懒得写现在没用。。。做成组件后加
//       childStyle[this.index].left = this.mouseXY.x - this.mouseXY.startX + this.mouseXY.left;
//     } else {
//       childStyle[this.index].top = this.mouseXY.y - this.mouseXY.startY + this.mouseXY.top;
//       this.swapIndex =
//         childStyle[this.index].top < this.childStyle[this.index].top ? 0 : this.index;
//       this.swapIndex =
//         childStyle[this.index].top >
//         this.childStyle[this.index].top + this.childStyle[this.index].height
//           ? childStyle.length - 1
//           : this.swapIndex;
//
//       const top = childStyle[this.index].top;
//       this.childStyle.forEach((item, i) => {
//         const cTop = item.top;
//         const cHeight = item.height + item.marginHeight;
//         if (top > cTop && top < cTop + cHeight) {
//           this.swapIndex = i;
//         }
//       });
//       animation = animation.map((item, i) => {
//         // 到顶端
//         let height = this.childStyle[this.index].height;
//         if (this.index < this.swapIndex) {
//           if (i > this.index && i <= this.swapIndex && this.swapIndex !== this.index) {
//             const start = this.index + 1;
//             const end = i;
//             height = 0;
//             this.childStyle.slice(start, end).forEach(_item => {
//               height += _item.height + _item.marginHeight;
//             });
//             return { top: this.childStyle[this.index].top + height };
//           }
//           if ((i > this.swapIndex || this.swapIndex === this.index) && i !== this.index) {
//             return { top: this.childStyle[i].top };
//           }
//         } else if (this.index > this.swapIndex) {
//           if (i < this.index && i >= this.swapIndex && this.swapIndex !== this.index) {
//             height = this.childStyle[this.index].height + this.childStyle[this.index].marginHeight;
//             return { top: this.childStyle[i].top + height };
//           }
//           if ((i < this.swapIndex || this.swapIndex === this.index) && i !== this.index) {
//             return { top: this.childStyle[i].top };
//           }
//         }
//         if (i !== this.index) {
//           return { top: this.childStyle[i].top };
//         }
//         return item;
//       });
//     }
//     this.setState({ childStyle, animation });
//   };
//
//   getChildren = (item, i) => {
//     const onMouseDown = this.onMouseDown.bind(this, i);
//     const style = { ...this.state.childStyle[i] };
//     return React.createElement(TweenOne, {
//       ...item.props,
//       onMouseDown,
//       onTouchStart: onMouseDown,
//       style: { ...item.style, ...style },
//       key: item.key,
//       animation: this.state.animation[i],
//       component: item.type
//     });
//   };
//
//   sortArray = (_array, nextNum, num) => {
//     const current = _array[num];
//     const array = _array.map(item => item);
//     array.splice(num, 1);
//     array.splice(nextNum, 0, current);
//     return array;
//   };
//
//   render() {
//     const childrenToRender = toArrayChildren(this.state.children).map(this.getChildren);
//     const props = { ...this.props };
//     ['component', 'animType', 'dragClassName', 'appearAnim', 'onEventChange'].forEach(
//       key => delete props[key]
//     );
//     if (this.props.appearAnim) {
//       return React.createElement(
//         QueueAnim,
//         {
//           ...props,
//           ...this.props.appearAnim,
//           style: { ...this.state.style }
//         },
//         childrenToRender
//       );
//     }
//     return React.createElement(
//       this.props.component,
//       {
//         ...props,
//         style: { ...this.state.style }
//       },
//       childrenToRender
//     );
//   }
// }
