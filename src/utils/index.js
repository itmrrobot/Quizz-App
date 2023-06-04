export function removeDuplicateElement(arr) {
    let newArr = [];
    newArr = arr?.filter((item) => {
        return newArr.includes(item)?'':newArr.push(item);
    })
    return newArr;
}