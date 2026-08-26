#!/bin/bash
# Insert imports
sed -i '/import { MentorProfileView/a import { ExplorerView } from "./views/ExplorerView";\nimport { MessagingView } from "./views/MessagingView";\nimport { SkillExchangeView } from "./views/SkillExchangeView";\nimport { ProjectPublishView } from "./views/ProjectPublishView";\nimport { OpportunitiesView } from "./views/OpportunitiesView";\nimport { AdminAuthView } from "./views/AdminAuthView";\nimport { AdminDashboardView } from "./views/AdminDashboardView";\nimport { FavoritesView } from "./views/FavoritesView";' src/App.tsx

# Insert new cases
sed -i '/case '"'"'onboarding'"'"':/i \
      case "explorer": return <ExplorerView onNavigate={handleNavigate} />;\n      case "messaging": return <MessagingView onNavigate={handleNavigate} />;\n      case "skill-exchange": return <SkillExchangeView onNavigate={handleNavigate} />;\n      case "project-publish": return <ProjectPublishView onNavigate={handleNavigate} />;\n      case "opportunities": return <OpportunitiesView onNavigate={handleNavigate} />;\n      case "admin-auth": return <AdminAuthView onNavigate={handleNavigate} />;\n      case "admin-dashboard": return <AdminDashboardView onNavigate={handleNavigate} />;\n      case "favorites": return <FavoritesView onNavigate={handleNavigate} />;' src/App.tsx

