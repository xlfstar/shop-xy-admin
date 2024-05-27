export function divideWithPrecision(dividend, divisor = 100) {
  // 执行除法运算
  var result = dividend / divisor

  // 将结果保留两位小数
  result = result.toFixed(2)

  // 将结果转换为字符串
  var resultString = result.toString()

  // 检查小数部分的长度，如果小于两位则补零
  var decimalIndex = resultString.indexOf('.')
  if (decimalIndex !== -1) {
    var decimalPart = resultString.substring(decimalIndex + 1)
    if (decimalPart.length < 2) {
      resultString += '0'
    }
  } else {
    // 如果结果是整数，则补上小数点和两个零
    resultString += '.00'
  }

  return resultString
}

export const createSkusList = (arr) => {
  const result = arr.reduce((acc, cur, index) => {
    // 从第二项开始合并值
    if (index > 0) {
      let saveArr = []
      acc.children.forEach((item) => {
        cur.children.forEach((subItem) => {
          const obj = {
            // spec_value_ids: `${item.id},${subItem.id}`,
            spec_value_names: `${item.name},${subItem.name}`,
            sku_image: '',
            price: 0,
            cost_price: 0,
            stock: 0,
            status: 0
          }
          saveArr.push(obj)
          // saveArr.push(`${item},${subItem}`)
        })
      })
      acc = saveArr
    }
    return acc
  }, arr[0])
  return result
}

function generateCombinations(specsArray) {
  // 递归函数用于生成规格组合
  function generateCombinationsRec(specsArray, index, currentCombination, combinations) {
    // 达到规格数组的末尾，将当前组合添加到结果中
    if (index === specsArray.length) {
      combinations.push(currentCombination)
      return
    }
    // 遍历当前规格的所有可能值
    for (let i = 0; i < specsArray[index].length; i++) {
      const newCombination = [...currentCombination]
      newCombination.push(specsArray[index][i])
      // 递归调用下一层规格
      generateCombinationsRec(specsArray, index + 1, newCombination, combinations)
    }
  }

  const combinations = []
  generateCombinationsRec(specsArray, 0, [], combinations)
  return combinations
}

export function generateSKU(specsArray) {
  const combinations = generateCombinations(specsArray)
  console.log('---combinations', combinations)
  const skus = combinations.map((combination) => {
    const sku = {
      spec_value_ids: combination.map((spec) => spec.id).join(','),
      spec_value_names: combination.map((spec) => spec.name).join(', ')
    }
    return sku
  })
  console.log('----skus', skus)
  return skus
}

export function calcSkus(attrValue) {
  // let attrValue = []
  // skuAttribute.map((item) => attrValue.push(item.values)) // 获取所有属性名称 => [['S','M'], ['白','黑']]

  // 开始构建sku
  let skus = []
  // 笛卡尔积算法（注意，我们的reduce没有指定第二个参数，则第一次循环中，col是数组第一位，set是数组第二位）
  skus = attrValue.reduce((col, set) => {
    console.log({ col })
    let res = []
    // 对于每个属性值集合，依次与当前已有的结果集做笛卡尔积
    col.children.forEach((c) => {
      set.children.forEach((s) => {
        // 将两个属性值合并为一个字符串，并存入结果集中
        let t = col.name + ':' + c.name + ',' + set.name + ':' + s.name
        // 寻找销售属性指定的图片
        res.push({ names: t })
      })
    })
    // 将笛卡尔积后的结果集返回，作为下一轮的结果集
    return res
  })
  // 将结果存储起来
  // stockKeepUnits.value = skus
  return skus
}

export function generateSkuTable(data) {
  const skus = []

  // 递归函数，用于生成SKU组合
  function generateCombinations(index, combination) {
    if (index === data.length) {
      skus.push(combination)
      return
    }

    const attribute = data[index]
    for (const child of attribute.children) {
      generateCombinations(index + 1, [...combination, { [attribute.name]: child.name }])
    }
  }

  generateCombinations(0, [])

  // 生成SKU表格
  const skuTable = skus.map((sku) => {
    const skuObj = {}
    sku.forEach((attribute) => {
      const key = Object.keys(attribute)[0]
      const value = attribute[key]
      skuObj[key] = value
    })
    return skuObj
  })

  return skuTable
}

export function reverseEngineerData(skuTable) {
  const data = []

  // 收集所有属性名称
  const attributeNames = Object.keys(skuTable[0])

  // 逐个属性创建对应的子属性
  attributeNames.forEach((attributeName) => {
    // if (attributeName !== 'name') return
    const children = skuTable.map((sku) => ({ name: sku[attributeName] }))
    data.push({ name: attributeName, children: children })
  })

  return data
}
// 原始数据

// 将具有非0 parent_id的项转换为children数组
export function groupByParentId(data) {
  var result = []
  var map = {}

  data.forEach(function (item) {
    // 如果parent_id为0，则直接加入结果数组
    if (item.parent_id === 0) {
      item.label = item.name
      item.value = item.id
      result.push(item)
    } else {
      // 将具有相同parent_id的项归类到相应的parent项下
      if (!map[item.parent_id]) {
        map[item.parent_id] = []
      }
      map[item.parent_id].push(item)
    }
  })

  // 将归类的子项加入到父项的children数组中
  result.forEach(function (item) {
    item.children = map[item.id] || []
  })

  return result
}
