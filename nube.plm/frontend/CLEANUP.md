# Cleanup Steps

After verifying the new feature-first architecture works, you can clean up old directories:

## Old Directories (Can be Deleted)

These are from the old type-first structure and are now duplicated in `products/` and `shared/`:

```bash
# Navigate to frontend src
cd nube.plm/frontend/src

# Delete old type-first structure
rm -rf types/
rm -rf lib/
rm -rf components/

# Keep only:
# - products/        (new feature-first structure)
# - shared/          (new shared code)
# - widgets/         (legacy export for backwards compat)
```

## Files to Keep

- ✅ `products/` - Complete product feature
- ✅ `shared/` - Cross-feature code
- ✅ `widgets/ProductTableWidget.tsx` - Legacy export (re-exports from products/widget/)
- ✅ `ARCHITECTURE.md` - Documentation
- ✅ `index.ts` - Main exports
- ✅ `vite-env.d.ts` - Type definitions

## Files to Delete (After Testing)

- ❌ `types/` - Moved to `products/common/types.ts`
- ❌ `lib/` - Moved to `products/common/` and `shared/`
- ❌ `components/` - Moved to `products/components/`, `products/dialogs/`, `shared/components/`
- ❌ `widgets/ProductTableWidget.old.tsx` - Old backup

## Testing Checklist

Before deleting old files, verify:

1. **Widget loads:** ProductTableWidget appears in scene-builder
2. **Products list:** Shows existing products
3. **Create works:** Can create new product
4. **Edit works:** Can edit existing product
5. **Delete works:** Can delete product
6. **No errors:** Check browser console

## Cleanup Command (Run After Testing)

```bash
cd /home/user/code/go/nube/rubix-plugin/nube.plm/frontend/src

# Backup old structure (optional)
tar -czf ../backup-old-structure-$(date +%Y%m%d).tar.gz types/ lib/ components/

# Delete old directories
rm -rf types/ lib/ components/

# Delete old backup file
rm widgets/ProductTableWidget.old.tsx

echo "✅ Cleanup complete! Only feature-first structure remains."
```

## Final Structure

After cleanup:
```
src/
├── products/          # Product feature (complete)
├── shared/            # Cross-feature code
├── widgets/           # Legacy exports (re-export from products/)
├── ARCHITECTURE.md
└── index.ts
```

Clean and maintainable! 🚀
