import { useMemo, useRef, useState } from 'react';

const relationTypes = ['association', 'aggregation', 'composition', 'inheritance', 'implements'];

const defaultClass = (index = 1) => ({
  id: `class-${Math.random().toString(36).slice(2, 10)}`,
  name: `Class${index}`,
  packageName: 'com.example',
  kind: 'class',
  x: 40 + (index % 4) * 260,
  y: 40 + Math.floor(index / 4) * 200,
  attributes: [],
  methods: [],
  extends: '',
  implements: [],
  isAbstract: false,
  isFinal: false,
});

const initialClasses = [
  {
    ...defaultClass(1),
    name: 'Customer',
    packageName: 'com.example.domain',
    x: 64,
    y: 60,
    attributes: [
      { id: 'attr-1', visibility: 'private', type: 'Long', name: 'id', isStatic: false, isFinal: false },
      { id: 'attr-2', visibility: 'private', type: 'String', name: 'name', isStatic: false, isFinal: false },
    ],
    methods: [
      { id: 'method-1', visibility: 'public', returnType: 'Long', name: 'getId', params: '', isStatic: false, isFinal: false, isAbstract: false },
      { id: 'method-2', visibility: 'public', returnType: 'String', name: 'getName', params: '', isStatic: false, isFinal: false, isAbstract: false },
    ],
  },
  {
    ...defaultClass(2),
    name: 'Order',
    packageName: 'com.example.domain',
    x: 420,
    y: 100,
    attributes: [
      { id: 'attr-3', visibility: 'private', type: 'Long', name: 'orderId', isStatic: false, isFinal: false },
    ],
    methods: [
      { id: 'method-3', visibility: 'public', returnType: 'void', name: 'addItem', params: 'String item', isStatic: false, isFinal: false, isAbstract: false },
    ],
  },
  {
    ...defaultClass(3),
    name: 'Payment',
    packageName: 'com.example.domain',
    x: 760,
    y: 70,
    attributes: [
      { id: 'attr-4', visibility: 'private', type: 'String', name: 'status', isStatic: false, isFinal: false },
    ],
    methods: [
      { id: 'method-4', visibility: 'public', returnType: 'boolean', name: 'isCompleted', params: '', isStatic: false, isFinal: false, isAbstract: false },
    ],
  },
];

const initialRelationships = [
  { id: 'rel-1', from: initialClasses[0].id, to: initialClasses[1].id, type: 'association' },
  { id: 'rel-2', from: initialClasses[1].id, to: initialClasses[2].id, type: 'composition' },
];

const visibilityOptions = ['private', 'protected', 'public'];
const javaTypeOptions = [
  'String',
  'int',
  'long',
  'boolean',
  'double',
  'float',
  'char',
  'byte',
  'short',
  'List',
  'Map',
  'Set',
  'Date',
  'UUID',
  'Object',
  'void',
];
const classKinds = ['class', 'interface', 'enum'];
const relationLabelMap = {
  association: 'association',
  aggregation: 'aggregation',
  composition: 'composition',
  inheritance: 'inheritance',
  implements: 'implements',
};

const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const getBoxDimensions = (classItem) => {
  const baseHeight = 96 + classItem.attributes.length * 22 + classItem.methods.length * 24;
  return {
    width: 240,
    height: Math.max(120, baseHeight),
  };
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function App() {
  const [classes, setClasses] = useState(initialClasses);
  const [relationships, setRelationships] = useState(initialRelationships);
  const [selectedClassId, setSelectedClassId] = useState(initialClasses[0].id);
  const [relationshipDraft, setRelationshipDraft] = useState({
    from: initialClasses[0].id,
    to: initialClasses[1].id,
    type: 'association',
  });
  const [dragState, setDragState] = useState(null);
  const canvasRef = useRef(null);

  const selectedClass = classes.find((item) => item.id === selectedClassId) || classes[0];

  const classMap = useMemo(
    () => new Map(classes.map((classItem) => [classItem.id, classItem])),
    [classes]
  );

  const updateSelectedClass = (updates) => {
    setClasses((current) =>
      current.map((classItem) =>
        classItem.id === selectedClassId ? { ...classItem, ...updates } : classItem
      )
    );
  };

  const updateSelectedClassList = (listKey, updater) => {
    setClasses((current) =>
      current.map((classItem) =>
        classItem.id === selectedClassId
          ? { ...classItem, [listKey]: updater(classItem[listKey]) }
          : classItem
      )
    );
  };

  const addClass = () => {
    const nextIndex = classes.length + 1;
    const newClass = {
      ...defaultClass(nextIndex),
      packageName: 'com.example.domain',
    };

    setClasses((current) => [...current, newClass]);
    setSelectedClassId(newClass.id);
  };

  const removeClass = () => {
    if (classes.length === 1) {
      return;
    }

    const nextClasses = classes.filter((classItem) => classItem.id !== selectedClassId);
    setClasses(nextClasses);
    setSelectedClassId(nextClasses[0].id);
    setRelationships((current) =>
      current.filter(
        (relationship) =>
          relationship.from !== selectedClassId && relationship.to !== selectedClassId
      )
    );
  };

  const addAttribute = () => {
    updateSelectedClassList('attributes', (current) => [
      ...current,
      {
        id: createId('attr'),
        visibility: 'private',
        type: 'String',
        name: 'newAttribute',
        isStatic: false,
        isFinal: false,
      },
    ]);
  };

  const addMethod = () => {
    updateSelectedClassList('methods', (current) => [
      ...current,
      {
        id: createId('method'),
        visibility: 'public',
        returnType: 'void',
        name: 'newMethod',
        params: '',
        isStatic: false,
        isFinal: false,
        isAbstract: false,
      },
    ]);
  };

  const updateAttribute = (id, field, value) => {
    updateSelectedClassList('attributes', (current) =>
      current.map((attribute) =>
        attribute.id === id ? { ...attribute, [field]: value } : attribute
      )
    );
  };

  const updateMethod = (id, field, value) => {
    updateSelectedClassList('methods', (current) =>
      current.map((method) =>
        method.id === id ? { ...method, [field]: value } : method
      )
    );
  };

  const removeAttribute = (id) => {
    updateSelectedClassList('attributes', (current) =>
      current.filter((attribute) => attribute.id !== id)
    );
  };

  const removeMethod = (id) => {
    updateSelectedClassList('methods', (current) =>
      current.filter((method) => method.id !== id)
    );
  };

  const addRelationship = () => {
    if (!relationshipDraft.from || !relationshipDraft.to || relationshipDraft.from === relationshipDraft.to) {
      return;
    }

    const nextRelationship = {
      id: createId('rel'),
      ...relationshipDraft,
    };

    setRelationships((current) => [...current, nextRelationship]);

    if (relationshipDraft.type === 'inheritance') {
      const sourceClass = classMap.get(relationshipDraft.from);
      const targetClass = classMap.get(relationshipDraft.to);
      if (sourceClass && targetClass) {
        setClasses((current) =>
          current.map((classItem) =>
            classItem.id === sourceClass.id
              ? { ...classItem, extends: targetClass.name }
              : classItem
          )
        );
      }
    }

    if (relationshipDraft.type === 'implements') {
      const sourceClass = classMap.get(relationshipDraft.from);
      const targetClass = classMap.get(relationshipDraft.to);
      if (sourceClass && targetClass) {
        setClasses((current) =>
          current.map((classItem) =>
            classItem.id === sourceClass.id
              ? {
                  ...classItem,
                  implements: [...new Set([...classItem.implements, targetClass.name])],
                }
              : classItem
          )
        );
      }
    }
  };

  const removeRelationship = (id) => {
    setRelationships((current) => current.filter((relationship) => relationship.id !== id));
  };

  const handleClassContextMenu = (event, classId) => {
    event.preventDefault();
    setSelectedClassId(classId);
  };

  const startDrag = (event, classId) => {
    const classItem = classMap.get(classId);
    if (!classItem || !canvasRef.current) {
      return;
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDragState({
      classId,
      startX: event.clientX,
      startY: event.clientY,
      originX: classItem.x,
      originY: classItem.y,
      canvasWidth: canvasRect.width,
      canvasHeight: canvasRect.height,
    });
  };

  const handleCanvasMouseMove = (event) => {
    if (!dragState) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    setClasses((current) =>
      current.map((classItem) => {
        if (classItem.id !== dragState.classId) {
          return classItem;
        }

        const dims = getBoxDimensions(classItem);
        return {
          ...classItem,
          x: clamp(dragState.originX + deltaX, 12, dragState.canvasWidth - dims.width - 12),
          y: clamp(dragState.originY + deltaY, 12, dragState.canvasHeight - dims.height - 12),
        };
      })
    );
  };

  const handleCanvasMouseUp = () => {
    setDragState(null);
  };

  const generatedJavaCode = useMemo(() => {
    const classPackage = classes[0]?.packageName || 'com.example';

    const classBlocks = classes.map((classItem, index) => {
      const attributeSection = classItem.attributes.length
        ? classItem.attributes
            .map((attribute) => {
              const attributeModifiers = [
                attribute.visibility,
                attribute.isStatic ? 'static' : '',
                attribute.isFinal ? 'final' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return `    ${attributeModifiers} ${attribute.type} ${attribute.name};`;
            })
            .join('\n')
        : '';

      const methodSection = classItem.methods.length
        ? classItem.methods
            .map((method) => {
              const isInterfaceMethod = classItem.kind === 'interface';
              const methodModifiers = [
                method.visibility,
                method.isStatic ? 'static' : '',
                method.isFinal ? 'final' : '',
                method.isAbstract && !isInterfaceMethod ? 'abstract' : '',
              ]
                .filter(Boolean)
                .join(' ');

              const methodBody =
                method.isAbstract || isInterfaceMethod
                  ? ';'
                  : ` {\n        // TODO: implement\n    }`;

              return `    ${methodModifiers} ${method.returnType} ${method.name}(${method.params || ''})${methodBody}`;
            })
            .join('\n\n')
        : '';

      const relationshipComments = relationships
        .filter(
          (relationship) =>
            relationship.from === classItem.id || relationship.to === classItem.id
        )
        .map((relationship) => {
          const counterpartId =
            relationship.from === classItem.id ? relationship.to : relationship.from;
          const counterpart = classMap.get(counterpartId);
          return `    // ${relationLabelMap[relationship.type]} with ${counterpart?.name || 'Unknown'};`;
        })
        .join('\n');

      const extendsClause = classItem.extends ? ` extends ${classItem.extends}` : '';
      const implementsClause =
        classItem.kind !== 'interface' && classItem.kind !== 'enum' && classItem.implements.length
          ? ` implements ${classItem.implements.join(', ')}`
          : '';

      const visibilityPrefix = index === 0 ? 'public ' : '';

      let classDeclaration = '';

      if (classItem.kind === 'interface') {
        classDeclaration = `${visibilityPrefix}interface ${classItem.name}${extendsClause} {`;
      } else if (classItem.kind === 'enum') {
        classDeclaration = `${visibilityPrefix}enum ${classItem.name}${implementsClause} {`;
      } else {
        const classKeyword = classItem.isAbstract ? 'abstract class' : 'class';
        const finalModifier = classItem.isFinal ? ' final' : '';
        classDeclaration = `${visibilityPrefix}${classKeyword}${finalModifier} ${classItem.name}${extendsClause}${implementsClause} {`;
      }

      const constructor =
        classItem.kind !== 'interface' && classItem.kind !== 'enum'
          ? `    public ${classItem.name}() {\n    }`
          : '';

      const classBodyParts = [];
      if (attributeSection) classBodyParts.push(attributeSection);
      if (constructor) classBodyParts.push(constructor);
      if (methodSection) classBodyParts.push(methodSection);
      if (relationshipComments) classBodyParts.push(relationshipComments);
      const classBody = classBodyParts.join('\n\n');

      return `${classDeclaration}\n${classBody}\n}`;
    });

    return [`package ${classPackage};`, '', ...classBlocks].join('\n');
  }, [classes, relationships, classMap]);

  const downloadJavaCode = () => {
    const blob = new Blob([generatedJavaCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'UMLDiagram.java';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!selectedClass) {
    return null;
  }

  return (
    <div className="app-shell">
      <aside className="panel left-panel">
        <div className="panel-header">
          <h2>Diagram Studio</h2>
        </div>

        <div className="section action-section">
          <button className="primary" onClick={addClass}>
            + Add Class
          </button>
          <button className="danger" onClick={removeClass}>
            Delete Selected
          </button>
        </div>

        <div className="section">
          <h3>Relationship Builder</h3>

          <label>
            From
            <select
              value={relationshipDraft.from}
              onChange={(event) =>
                setRelationshipDraft((current) => ({
                  ...current,
                  from: event.target.value,
                }))
              }
            >
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            To
            <select
              value={relationshipDraft.to}
              onChange={(event) =>
                setRelationshipDraft((current) => ({
                  ...current,
                  to: event.target.value,
                }))
              }
            >
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Type
            <select
              value={relationshipDraft.type}
              onChange={(event) =>
                setRelationshipDraft((current) => ({
                  ...current,
                  type: event.target.value,
                }))
              }
            >
              {relationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <button className="primary" onClick={addRelationship}>
            Add Relationship
          </button>
        </div>

        <div className="section relationships-list">
          <h3>Relationships</h3>
          {relationships.length === 0 ? (
            <p className="empty-state">No relationships yet.</p>
          ) : (
            <ul>
              {relationships.map((relationship) => {
                const fromClass = classMap.get(relationship.from);
                const toClass = classMap.get(relationship.to);

                return (
                  <li key={relationship.id}>
                    <span>
                      {fromClass?.name || 'Unknown'} → {toClass?.name || 'Unknown'}
                    </span>
                    <small>{relationship.type}</small>
                    <button onClick={() => removeRelationship(relationship.id)}>Remove</button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <main className="canvas-panel">
        <div className="canvas-toolbar">
          <div>
            <strong>Interactive UML Editor</strong>
          </div>
          <div className="legend">
            <span><i className="dot blue" /> Association</span>
            <span><i className="dot purple" /> Aggregation</span>
            <span><i className="dot green" /> Composition</span>
            <span><i className="dot orange" /> Inheritance</span>
            <span><i className="dot red" /> Implements</span>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="canvas"
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          <svg className="connections" preserveAspectRatio="none">
            <defs>
              <marker
                id="arrow-marker"
                markerWidth="12"
                markerHeight="12"
                refX="10"
                refY="6"
                orient="auto"
              >
                <path d="M0,0 L12,6 L0,12 z" fill="#4f46e5" />
              </marker>
            </defs>

            {relationships.map((relationship) => {
              const fromClass = classMap.get(relationship.from);
              const toClass = classMap.get(relationship.to);

              if (!fromClass || !toClass) {
                return null;
              }

              const fromDims = getBoxDimensions(fromClass);
              const toDims = getBoxDimensions(toClass);

              const startX = fromClass.x + fromDims.width;
              const startY = fromClass.y + fromDims.height / 2;
              const endX = toClass.x;
              const endY = toClass.y + toDims.height / 2;
              const midX = (startX + endX) / 2;

              const isDashed =
                relationship.type === 'aggregation' || relationship.type === 'composition';

              return (
                <g key={relationship.id}>
                  <path
                    d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                    stroke={
                      relationship.type === 'association'
                        ? '#4f46e5'
                        : relationship.type === 'aggregation'
                          ? '#8b5cf6'
                          : relationship.type === 'composition'
                            ? '#10b981'
                            : relationship.type === 'inheritance'
                              ? '#f59e0b'
                              : '#ef4444'
                    }
                    fill="none"
                    strokeWidth="2.2"
                    strokeDasharray={isDashed ? '8 6' : '0'}
                    markerEnd="url(#arrow-marker)"
                  />

                  <text
                    x={midX}
                    y={Math.min(startY, endY) - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#475569"
                  >
                    {relationLabelMap[relationship.type]}
                  </text>
                </g>
              );
            })}
          </svg>

          {classes.map((classItem) => {
            const dims = getBoxDimensions(classItem);
            const isSelected = classItem.id === selectedClassId;

            return (
              <div
                key={classItem.id}
                className={`class-node ${isSelected ? 'selected' : ''}`}
                style={{
                  left: classItem.x,
                  top: classItem.y,
                  width: dims.width,
                  minHeight: dims.height,
                }}
                onClick={() => setSelectedClassId(classItem.id)}
                onContextMenu={(event) => handleClassContextMenu(event, classItem.id)}
                onMouseDown={(event) => {
                  setSelectedClassId(classItem.id);
                  startDrag(event, classItem.id);
                }}
              >
                <div className="class-header">
                  <span className="class-kind">{classItem.kind}</span>
                  <span className="class-name">{classItem.name}</span>
                </div>

                <div className="class-body">
                  {classItem.attributes.length > 0 ? (
                    <div className="section-block">
                      {classItem.attributes.map((attribute) => (
                        <div key={attribute.id} className="field-row">
                          <span className="member-visibility">{attribute.visibility}</span>
                          <span className="member-modifiers">
                            {attribute.isStatic ? 'static ' : ''}
                            {attribute.isFinal ? 'final ' : ''}
                          </span>
                          <span className="member-type">{attribute.type}</span>
                          <span className="member-name">{attribute.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="section-empty">Attributes</div>
                  )}

                  {classItem.methods.length > 0 ? (
                    <div className="section-block">
                      {classItem.methods.map((method) => (
                        <div key={method.id} className="field-row">
                          <span className="member-visibility">{method.visibility}</span>
                          <span className="member-modifiers">
                            {method.isStatic ? 'static ' : ''}
                            {method.isFinal ? 'final ' : ''}
                            {method.isAbstract ? 'abstract ' : ''}
                          </span>
                          <span className="member-type">{method.returnType}</span>
                          <span className="member-name">{method.name}</span>
                          <span className="member-params">({method.params || ''})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="section-empty">Methods</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <aside className="panel right-panel">
        <div className="panel-card">
          <div className="panel-header">
            <h2>Class Details</h2>
          </div>

          {selectedClass && (
            <div className="properties">
              <label>
                Class name
                <input
                  value={selectedClass.name}
                  onChange={(event) => updateSelectedClass({ name: event.target.value })}
                />
              </label>

              <label>
                Package
                <input
                  value={selectedClass.packageName}
                  onChange={(event) => updateSelectedClass({ packageName: event.target.value })}
                />
              </label>

              <label>
                Kind
                <select
                  value={selectedClass.kind}
                  onChange={(event) => updateSelectedClass({ kind: event.target.value })}
                >
                  {classKinds.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </label>

              <div className="toggle-grid">
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={selectedClass.isAbstract}
                    onChange={(event) => updateSelectedClass({ isAbstract: event.target.checked })}
                  />
                  Abstract
                </label>
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={selectedClass.isFinal}
                    onChange={(event) => updateSelectedClass({ isFinal: event.target.checked })}
                  />
                  Final
                </label>
              </div>

              <label>
                Extends
                <input
                  value={selectedClass.extends}
                  onChange={(event) => updateSelectedClass({ extends: event.target.value })}
                />
              </label>

              <label>
                Implements
                <input
                  value={selectedClass.implements.join(', ')}
                  onChange={(event) =>
                    updateSelectedClass({
                      implements: event.target.value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>

              <div className="subsection-header">
                <h3>Attributes</h3>
                <button className="soft" onClick={addAttribute}>+ Add</button>
              </div>

              {selectedClass.attributes.length === 0 ? (
                <p className="empty-state">No attributes yet.</p>
              ) : (
                selectedClass.attributes.map((attribute) => (
                  <div key={attribute.id} className="member-editor">
                    <input
                      value={attribute.name}
                      onChange={(event) =>
                        updateAttribute(attribute.id, 'name', event.target.value)
                      }
                    />
                    <select
                      value={attribute.type}
                      onChange={(event) =>
                        updateAttribute(attribute.id, 'type', event.target.value)
                      }
                    >
                      {javaTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <select
                      value={attribute.visibility}
                      onChange={(event) =>
                        updateAttribute(attribute.id, 'visibility', event.target.value)
                      }
                    >
                      {visibilityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <label className="toggle-pill">
                      <input
                        type="checkbox"
                        checked={attribute.isStatic}
                        onChange={(event) =>
                          updateAttribute(attribute.id, 'isStatic', event.target.checked)
                        }
                      />
                      Static
                    </label>
                    <label className="toggle-pill">
                      <input
                        type="checkbox"
                        checked={attribute.isFinal}
                        onChange={(event) =>
                          updateAttribute(attribute.id, 'isFinal', event.target.checked)
                        }
                      />
                      Final
                    </label>
                    <button className="danger-small" onClick={() => removeAttribute(attribute.id)}>
                      Delete
                    </button>
                  </div>
                ))
              )}

              <div className="subsection-header">
                <h3>Methods</h3>
                <button className="soft" onClick={addMethod}>+ Add</button>
              </div>

              {selectedClass.methods.length === 0 ? (
                <p className="empty-state">No methods yet.</p>
              ) : (
                selectedClass.methods.map((method) => (
                  <div key={method.id} className="member-editor methods-editor">
                    <input
                      value={method.name}
                      onChange={(event) =>
                        updateMethod(method.id, 'name', event.target.value)
                      }
                    />
                    <select
                      value={method.returnType}
                      onChange={(event) =>
                        updateMethod(method.id, 'returnType', event.target.value)
                      }
                    >
                      {javaTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <input
                      value={method.params}
                      onChange={(event) =>
                        updateMethod(method.id, 'params', event.target.value)
                      }
                      placeholder="params"
                    />
                    <select
                      value={method.visibility}
                      onChange={(event) =>
                        updateMethod(method.id, 'visibility', event.target.value)
                      }
                    >
                      {visibilityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <label className="toggle-pill">
                      <input
                        type="checkbox"
                        checked={method.isStatic}
                        onChange={(event) =>
                          updateMethod(method.id, 'isStatic', event.target.checked)
                        }
                      />
                      Static
                    </label>
                    <label className="toggle-pill">
                      <input
                        type="checkbox"
                        checked={method.isFinal}
                        onChange={(event) =>
                          updateMethod(method.id, 'isFinal', event.target.checked)
                        }
                      />
                      Final
                    </label>
                    <label className="toggle-pill">
                      <input
                        type="checkbox"
                        checked={method.isAbstract}
                        onChange={(event) =>
                          updateMethod(method.id, 'isAbstract', event.target.checked)
                        }
                      />
                      Abstract
                    </label>
                    <button className="danger-small" onClick={() => removeMethod(method.id)}>
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="panel-card code-card">
          <div className="panel-header code-header">
            <h2>Java Code</h2>
            <button className="primary" onClick={downloadJavaCode}>
              Export .java
            </button>
          </div>
          <pre>{generatedJavaCode}</pre>
        </div>
      </aside>
    </div>
  );
}

export default App;
