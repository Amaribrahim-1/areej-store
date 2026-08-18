# areej-teach — walkthrough templates

Overwrite `docs/walkthroughs/current.md` only. Teaching prose: Egyptian
Arabic. Usage contract: English only.

Omit a heading when it has nothing to say — except reviews must still have
must/should/ذوق (write `none` if that bucket is empty) and the bare change
list.

---

## Backend

```markdown
# شرح الباك — تاسك <id>

- التاريخ:
- النوع: backend

## المشكلة والحل

جملتين: إيه المشكلة في المنتج، وإيه اللي اتشحن عشان يحلها.

## عقد الاستخدام (English)

### `<functionName>` — `src/features/<name>/api/<file>.ts`

- **Params:**
- **Returns:** (incl. empty/`null`)
- **Errors:** throws vs empty
- **Call:**

\`\`\`ts
const row = await getThing(id)
\`\`\`

(Repeat per exported function. No queryKey / hook / types-file recipes.)

## الصفحات والملفات

لكل صفحة أو ملف اتلمس — سطر أو اتنين، من غير شرح جوّه الدالة:

- `path` أو `/url` — هو إيه، المحتوى/الدور إيه.

## التدفق

خطوات مرقّمة من الفعل لحد الداتا. فين الغلط بيتقفش.

## قرارات مهمة وليه

بس القرارات اللي لو اتعملت العكس هتكسر أمان أو سلوك. جملة ليه لكل واحدة.

## تحقق بنفسك

(احذف القسم لو التغيير مش أمان/مش سلوك يتعمل له كليك.)
```

---

## Full-task

```markdown
# شرح التاسك — <id>

- التاريخ:
- النوع: full-task

## المشكلة والحل

إيه المشكلة، وإيه الحل اللي اتعمل.

## الصفحات والملفات

لكل صفحة اتلمست:

- `/url` (`src/app/.../page.tsx`) — المستخدم يعمل إيه هنا، الصفحة فيها إيه.
  من غير شرح الكود جوّاها.

بعد الصفحات: الملفات التانية (helpers, layout, schema) بنفس الشكل: مسار + سطر.

## عقد الاستخدام (English, if any `get*` / mutate shipped)

نفس شكل الباك. لو مفيش: احذف القسم.

## التدفق

من الفعل لحد الداتا، مرقّم.

## قرارات مهمة وليه

## تحقق بنفسك

(احذف القسم لو مش مستاهل.)
```

---

## Review

Problems only. No clean-section praise. No long why.

```markdown
# مراجعة — <id>

- النوع: review

## must

- في `path`: المشكلة. الحل: …

(أو `none`)

## should

- في `path`: المشكلة. الحل: …

(أو `none`)

## ذوق

- في `path`: المشكلة. الحل: …

(أو `none`)

## اللي هيتعدل

- …
- …
```

The last list is the same items with **no** explanation — a checklist they
can tick. If a bucket is `none`, it does not appear again in اللي هيتعدل.
