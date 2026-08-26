sed -i '/<div className="flex items-center gap-3">/,/<\/form>/c\
            <div className="flex items-center gap-3">\
              <button\
                type="button"\
                onClick={onClose}\
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium text-xs hover:bg-stone-50 transition-colors"\
              >\
                Annuler\
              </button>\
              <button\
                type="submit"\
                disabled={isSaving}\
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white font-medium text-xs transition-colors shadow-sm disabled:opacity-50"\
              >\
                <Save className="w-4 h-4" />\
                <span>{isSaving ? "Enregistrement..." : "Enregistrer les modifications"}</span>\
              </button>\
            </div>\
          </div>\
        </form>\
' src/components/ProfileModal.tsx
