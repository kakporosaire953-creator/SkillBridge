sed -i 's/| '"'"'privacy'"'"';/| '"'"'privacy'"'"'\n  | '"'"'public-passport'"'"';/' src/types/platform.ts

sed -i '/import { PublicProfileView }/a import { PublicPassportVerificationView } from "./views/PublicPassportVerificationView";' src/App.tsx

sed -i '/case '"'"'public-profile'"'"':/a \
      case '"'"'public-passport'"'"':\
        return <PublicPassportVerificationView onNavigate={handleNavigate} passportId={verifyCertId} />;' src/App.tsx
