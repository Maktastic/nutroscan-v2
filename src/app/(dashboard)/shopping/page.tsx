'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Check, 
  X, 
  Printer, 
  Download,
  Search,
  Filter,
  ChevronDown,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

// Mock data - replace with API calls
const mockShoppingList = {
  id: '1',
  mealPlanId: 'mp_123',
  weekOf: new Date(),
  categories: [
    {
      name: 'Produce',
      items: [
        { id: 1, name: 'Spinach', quantity: '2 bunches', checked: false },
        { id: 2, name: 'Tomatoes', quantity: '6 medium', checked: true },
        { id: 3, name: 'Avocados', quantity: '4', checked: false },
        { id: 4, name: 'Broccoli', quantity: '2 heads', checked: false },
      ]
    },
    {
      name: 'Proteins',
      items: [
        { id: 5, name: 'Chicken Breast', quantity: '2 lbs', checked: false },
        { id: 6, name: 'Salmon', quantity: '1.5 lbs', checked: false },
        { id: 7, name: 'Greek Yogurt', quantity: '32 oz', checked: true },
      ]
    },
    {
      name: 'Grains & Legumes',
      items: [
        { id: 8, name: 'Quinoa', quantity: '1 lb', checked: false },
        { id: 9, name: 'Brown Rice', quantity: '2 lbs', checked: false },
        { id: 10, name: 'Black Beans', quantity: '2 cans', checked: false },
      ]
    },
  ]
}

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState(mockShoppingList)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const toggleItem = (categoryIndex: number, itemId: number) => {
    const updatedList = { ...shoppingList }
    const item = updatedList.categories[categoryIndex].items.find(i => i.id === itemId)
    if (item) {
      item.checked = !item.checked
      setShoppingList(updatedList)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // Convert to text format
    let text = `Shopping List - Week of ${shoppingList.weekOf.toLocaleDateString()}\n\n`
    
    shoppingList.categories.forEach(category => {
      text += `${category.name}:\n`
      category.items.forEach(item => {
        text += `${item.checked ? '✓' : '○'} ${item.name} - ${item.quantity}\n`
      })
      text += '\n'
    })

    // Create and download file
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shopping-list.txt'
    a.click()
    
    toast.success('Shopping list exported!')
  }

  const filteredCategories = shoppingList.categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    selectedCategory === 'all' || category.name === selectedCategory
  )

  const totalItems = shoppingList.categories.reduce(
    (sum, cat) => sum + cat.items.length, 0
  )
  const checkedItems = shoppingList.categories.reduce(
    (sum, cat) => sum + cat.items.filter(i => i.checked).length, 0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
          <p className="text-gray-600 mt-1">
            Week of {shoppingList.weekOf.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Shopping Progress</h3>
          <span className="text-sm text-gray-600">
            {checkedItems} of {totalItems} items
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(checkedItems / totalItems) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200"
        >
          <option value="all">All Categories</option>
          {shoppingList.categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Shopping List */}
      <div className="space-y-6">
        {filteredCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
            </div>
            <div className="divide-y">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    item.checked ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleItem(categoryIndex, item.id)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        item.checked
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {item.checked && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div>
                      <p className={`font-medium ${item.checked ? 'line-through' : ''}`}>
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">{item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Custom Item */}
      <div className="bg-gray-50 rounded-xl p-6">
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Item
        </Button>
      </div>
    </div>
  )
}
