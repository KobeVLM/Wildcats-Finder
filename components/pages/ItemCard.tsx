import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Calendar, MapPin, User as UserIcon, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Item {
  id: string;
  type: 'lost' | 'found';
  name: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl?: string;
  reportedBy: string;
  status: 'active' | 'claimed' | 'pending';
}

interface ItemCardProps {
  item: Item;
  onClaim: (item: Item) => void;
  showClaimButton?: boolean;
}

export function ItemCard({ item, onClaim, showClaimButton = true }: ItemCardProps) {
  const categoryIcons: Record<string, string> = {
    'Electronics': '📱',
    'Books': '📚',
    'Clothing': '👕',
    'Accessories': '🎒',
    'IDs & Cards': '🪪',
    'Keys': '🔑',
    'Other': '📦',
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        transition: 'box-shadow 0.3s',
      }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        {item.imageUrl ? (
          <CardMedia
            component="img"
            height="200"
            image={item.imageUrl}
            alt={item.name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to bottom right, #f8f8f8, #e5e5e5)',
              fontSize: '4rem',
            }}
          >
            {categoryIcons[item.category] || '📦'}
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip
            label={item.type === 'lost' ? 'Lost' : 'Found'}
            size="small"
            sx={{
              bgcolor: item.type === 'lost' ? 'error.main' : 'success.main',
              color: 'white',
              fontWeight: 500,
            }}
          />
          <Chip
            label={item.status}
            size="small"
            color="secondary"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: 2 }}>
        <Box sx={{ minHeight: 80 }}>
          <Typography 
            variant="h6" 
            color="primary" 
            gutterBottom
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1,
            }}
          >
            {item.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '40px',
            }}
          >
            {item.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Package size={16} color="#737373" />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.category}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapPin size={16} color="#737373" />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} color="#737373" />
            <Typography variant="body2" color="text.secondary">
              {new Date(item.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UserIcon size={16} color="#737373" />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.reportedBy.split('@')[0]}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {showClaimButton && item.status === 'active' && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => onClaim(item)}
          >
            {item.type === 'lost' ? 'I Found This!' : 'This is Mine!'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
