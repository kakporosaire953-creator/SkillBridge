sed -i '/<div className="text-center py-20 bg-white rounded-3xl border border-\[#E2E8E5\] shadow-xs">/i \
        {activeTab === '"'"'personnes'"'"' ? (\
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">\
            <div \
              onClick={() => onNavigate('"'"'public-profile'"'"')}\
              className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"\
            >\
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#123B5D] to-[#59B83E] flex items-center justify-center text-white text-xl font-bold font-heading mb-4">\
                J\
              </div>\
              <h3 className="font-bold text-[#101820] text-lg">Jean Dupont</h3>\
              <p className="text-sm text-[#123B5D] font-medium mb-1">Développeur Full Stack</p>\
              <p className="text-xs text-stone-500 mb-4">Dakar, Sénégal</p>\
              <div className="flex flex-wrap gap-2 justify-center">\
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">React</span>\
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">Node.js</span>\
              </div>\
            </div>\
            <div \
              onClick={() => onNavigate('"'"'public-profile'"'"')}\
              className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"\
            >\
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#59B83E] to-[#123B5D] flex items-center justify-center text-white text-xl font-bold font-heading mb-4">\
                A\
              </div>\
              <h3 className="font-bold text-[#101820] text-lg">Amina Diallo</h3>\
              <p className="text-sm text-[#123B5D] font-medium mb-1">UI/UX Designer</p>\
              <p className="text-xs text-stone-500 mb-4">Abidjan, Côte d'"'"'Ivoire</p>\
              <div className="flex flex-wrap gap-2 justify-center">\
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">Figma</span>\
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">Design System</span>\
              </div>\
            </div>\
          </div>\
        ) : (\
' src/views/ExplorerView.tsx
sed -i 's/Retour au Dashboard/Retour au Dashboard\n          <\/button>\n        <\/div>\n        )}/g' src/views/ExplorerView.tsx
