import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
  subcategories: Category[];
}

interface CategoryItemProps {
  category: Category;
  onAddSubcategory: (categoryId: string) => void;
  onRemoveCategory: (categoryId: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onAddSubcategory, onRemoveCategory }) => {
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() !== '') {
      const newSubcategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: newSubcategoryName,
        subcategories: []
      };
      category.subcategories.push(newSubcategory);
      setNewSubcategoryName('');
      onAddSubcategory(category.id);
    }
  };

  const handleRemoveCategory = () => {
    onRemoveCategory(category.id);
  };

  return (
    <div>
      {category.name}
      <button onClick={handleAddSubcategory}>+</button>
      <button onClick={handleRemoveCategory}>-</button>
      <ul>
        {category.subcategories.map(subcategory => (
          <li key={subcategory.id}>
            <CategoryItem
              category={subcategory}
              onAddSubcategory={onAddSubcategory}
              onRemoveCategory={onRemoveCategory}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const CategoryApp: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Main Category', subcategories: [] }
  ]);

  const handleAddSubcategory = (categoryId: string) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return { ...category };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  const handleRemoveCategory = (categoryId: string) => {
    const removeCategory = (categoryList: Category[], targetId: string) => {
      return categoryList.filter(category => {
        if (category.id === targetId) {
          return false;
        }
        category.subcategories = removeCategory(category.subcategories, targetId);
        return true;
      });
    };

    const updatedCategories = removeCategory(categories, categoryId);
    setCategories(updatedCategories);
  };

  return (
    <div>
      <h2>Category App</h2>
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
          onAddSubcategory={handleAddSubcategory}
          onRemoveCategory={handleRemoveCategory}
        />
      ))}
    </div>
  );
};

export default CategoryApp;
