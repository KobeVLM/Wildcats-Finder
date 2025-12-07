import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { ItemCard, type Item } from './ItemCard';
import { Filter, X } from 'lucide-react';

interface SearchPageProps {
  items: Item[];
  onClaim: (item: Item) => void;
}

const categories = [
  'All',
  'Electronics',
  'Books',
  'Clothing',
  'Accessories',
  'IDs & Cards',
  'Keys',
  'Other',
];
const locations = [
  'All',
  'Main Campus - Building A',
  'Main Campus - Building B',
  'Main Campus - Building C',
  'Main Campus - Library',
  'Main Campus - Cafeteria',
  'Main Campus - Gymnasium',
  'Main Campus - Chapel',
  'Main Campus - Parking Area',
  'NTC Campus',
];

export function SearchPage({ items, onClaim }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
    const matchesType = selectedType === 'all' || item.type === selectedType;

    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(item.date) >= new Date(dateFrom);
    }
    if (dateTo) {
      matchesDate = matchesDate && new Date(item.date) <= new Date(dateTo);
    }

    return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesDate;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedType('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'All' || selectedLocation !== 'All' || selectedType !== 'all' || dateFrom || dateTo;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" color="primary" gutterBottom>
              Search Items
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Use filters to find specific items
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search by item name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ bgcolor: 'white', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
        />

        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" color="primary">
                  Filters
                </Typography>
                {hasActiveFilters && (
                  <Button variant="text" size="small" startIcon={<X size={16} />} onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Item Type
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
                  >
                    <MenuItem value="all">All Items</MenuItem>
                    <MenuItem value="lost">Lost Only</MenuItem>
                    <MenuItem value="found">Found Only</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Category
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Location
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    {locations.map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Date Range
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="From"
                      size="small"
                    />
                    <TextField
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder="To"
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </Typography>
          </Box>

          {filteredItems.length === 0 ? (
            <Card>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: '#f8f8f8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Filter size={32} color="#737373" />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No items match your filters
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try adjusting your search criteria
                </Typography>
                {hasActiveFilters && (
                  <Button variant="outlined" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <ItemCard item={item} onClaim={onClaim} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
}
