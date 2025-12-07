import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const categories = [
  'Electronics',
  'Books',
  'Clothing',
  'Accessories',
  'IDs & Cards',
  'Keys',
  'Other',
];

const campusLocations = [
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

export function ReportForm({ type, onSubmit, userEmail }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [imageFile, setImageFile] = useState(null); // eslint-disable-line no-unused-vars
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      type,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      date: formData.date,
      imageUrl: imagePreview || undefined,
    };

    onSubmit(newItem);

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
    });
    setImageFile(null);
    setImagePreview('');
  };

  const Icon = type === 'lost' ? AlertCircle : CheckCircle;

  return (
    <Card sx={{ maxWidth: 672, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: type === 'lost' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              size={24}
              color={type === 'lost' ? '#dc2626' : '#16a34a'}
            />
          </Box>
          <Box>
            <Typography variant="h5">
              Report {type === 'lost' ? 'Lost' : 'Found'} Item
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details below to help reunite items with their owners
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Item Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g., iPhone 13 Pro, Blue Backpack"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Description *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Provide details like color, brand, distinctive features, or where exactly you lost/found it..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Category *
                </Typography>
                <TextField
                  fullWidth
                  select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Campus Location *
                </Typography>
                <TextField
                  fullWidth
                  select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                >
                  {campusLocations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Date {type === 'lost' ? 'Lost' : 'Found'} *
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                }}
                required
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Photo (Optional)
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'rgba(248, 248, 248, 0.3)',
                }}
              >
                {imagePreview ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        maxHeight: 192,
                        borderRadius: 2,
                        mx: 'auto',
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                    >
                      Remove Photo
                    </Button>
                  </Box>
                ) : (
                  <Box
                    component="label"
                    sx={{
                      cursor: 'pointer',
                      display: 'block',
                    }}
                  >
                    <Upload size={32} color="#737373" style={{ marginBottom: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PNG, JPG up to 5MB
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!formData.name || !formData.description || !formData.category || !formData.location}
            >
              Submit Report
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
