# Update App.tsx to import and route public-profile
sed -i '/import { AdminDashboardView } from '"'"'.\/views\/AdminDashboardView'"'"';/a import { PublicProfileView } from '"'"'.\/views\/PublicProfileView'"'"';' src/App.tsx
sed -i '/<AdminDashboardView onNavigate={handleNavigate} \/>/a \
        case '"'"'public-profile'"'"':\
          return <PublicProfileView onNavigate={handleNavigate} \/>;' src/App.tsx
