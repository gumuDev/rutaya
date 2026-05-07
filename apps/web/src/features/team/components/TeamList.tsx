'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Alert, Popconfirm, Typography, Tag, Space, Card, Row, Col, Flex, Grid } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from '@/shared/lib/dayjs';
import { Operator, CreateOperatorPayload, UpdateOperatorPayload } from '../types/team.types';
import { listOperators, createOperator, updateOperator, deleteOperator } from '../services/team.service';
import { PageLayout } from '@/shared/components/PageLayout';
import { colors } from '@/shared/theme/colors';

const { Text } = Typography;
const { useBreakpoint } = Grid;

export function TeamList() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Operator | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  function load() {
    setLoading(true);
    listOperators()
      .then(setOperators)
      .catch(() => setError('Error al cargar operadores'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openEdit(operator: Operator) {
    editForm.setFieldsValue({ name: operator.name, email: operator.email, phone: operator.phone });
    setEditing(operator);
    setFormError(null);
  }

  async function handleCreate(values: CreateOperatorPayload) {
    setSaving(true);
    setFormError(null);
    try {
      await createOperator(values);
      createForm.resetFields();
      setAdding(false);
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'save_failed';
      setFormError(msg === 'email_already_registered' ? 'Este email ya está registrado' : 'Error al crear el operador');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(values: UpdateOperatorPayload) {
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    try {
      await updateOperator(editing.id, values);
      setEditing(null);
      load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'save_failed';
      setFormError(msg === 'email_already_registered' ? 'Este email ya está registrado' : 'Error al actualizar el operador');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteOperator(id);
      setOperators((prev) => prev.filter((o) => o.id !== id));
    } catch {
      setError('Error al eliminar el operador');
    }
  }

  const columns: ColumnsType<Operator> = [
    {
      title: 'Operador', key: 'name',
      render: (_, r) => (
        <Flex align="center" gap={8}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: colors.accent, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserOutlined style={{ color: colors.secondary, fontSize: 14 }} />
          </div>
          <Flex vertical gap={0}>
            <Text strong style={{ fontSize: 14 }}>{r.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
          </Flex>
        </Flex>
      ),
    },
    { title: 'Teléfono', dataIndex: 'phone', key: 'phone', render: (v) => v || '—', responsive: ['md'] as never[] },
    {
      title: 'Agregado', dataIndex: 'createdAt', key: 'createdAt', responsive: ['md'] as never[],
      render: (d) => dayjs(d).format('DD/MM/YYYY'),
    },
    { title: 'Rol', key: 'role', render: () => <Tag color="blue">Operador</Tag> },
    {
      title: 'Acciones', key: 'actions', width: 100,
      render: (_, r) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} />
          <Popconfirm title="¿Eliminar este operador?" onConfirm={() => handleDelete(r.id)} okText="Sí" cancelText="No">
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageLayout
      title="Equipo"
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setAdding(true); setFormError(null); }}
          style={{ background: colors.primary, borderColor: colors.primary }}>
          {isMobile ? null : 'Agregar operador'}
        </Button>
      }
    >
      {error && <Alert title={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <div style={{ marginBottom: 16, padding: '12px 16px', background: colors.accent, borderRadius: 8, border: `1px solid #FED7AA` }}>
        <Text style={{ fontSize: 13 }}>
          Los operadores pueden <Text strong>gestionar reservas</Text> pero no tienen acceso a rutas, vehículos, horarios ni configuración.
        </Text>
      </div>

      {isMobile ? (
        loading ? <Text type="secondary">Cargando...</Text> :
        operators.length === 0 ? <Text type="secondary">No hay operadores registrados.</Text> : (
          <Row gutter={[12, 12]}>
            {operators.map((o) => (
              <Col xs={24} key={o.id}>
                <Card size="small" style={{ borderRadius: 8 }}>
                  <Flex justify="space-between" align="center">
                    <Space>
                      <UserOutlined style={{ color: colors.secondary }} />
                      <Flex vertical gap={2}>
                        <Text strong>{o.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{o.email}</Text>
                      </Flex>
                    </Space>
                    <Space>
                      <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(o)} />
                      <Popconfirm title="¿Eliminar?" onConfirm={() => handleDelete(o.id)} okText="Sí" cancelText="No">
                        <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                      </Popconfirm>
                    </Space>
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>
        )
      ) : (
        <Table
          columns={columns}
          dataSource={operators}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{ emptyText: 'No hay operadores registrados.' }}
        />
      )}

      {/* Modal crear */}
      <Modal open={adding} onCancel={() => { setAdding(false); createForm.resetFields(); }}
        title="Agregar operador" footer={null} destroyOnHidden>
        {formError && <Alert title={formError} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form form={createForm} layout="vertical" onFinish={handleCreate} requiredMark={false}>
          <Form.Item name="name" label="Nombre completo" rules={[{ required: true }]}>
            <Input size="large" placeholder="Ej. María López" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" placeholder="operador@empresa.com" />
          </Form.Item>
          <Form.Item name="password" label="Contraseña temporal" rules={[{ required: true, min: 6, message: 'Mínimo 6 caracteres' }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Alert title="El operador usará este email y contraseña para ingresar al sistema." type="info" showIcon style={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => { setAdding(false); createForm.resetFields(); }}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={saving}
              style={{ background: colors.primary, borderColor: colors.primary }}>
              Crear operador
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal editar */}
      <Modal open={!!editing} onCancel={() => { setEditing(null); setFormError(null); }}
        title="Editar operador" footer={null} destroyOnHidden>
        {formError && <Alert title={formError} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form form={editForm} layout="vertical" onFinish={handleUpdate} requiredMark={false}>
          <Form.Item name="name" label="Nombre completo" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="phone" label="Teléfono">
            <Input size="large" placeholder="+591 70000000" />
          </Form.Item>
          <Form.Item name="password" label="Nueva contraseña" extra="Déjalo vacío para no cambiarla">
            <Input.Password size="large" placeholder="Nueva contraseña (opcional)" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => { setEditing(null); setFormError(null); }}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={saving}
              style={{ background: colors.primary, borderColor: colors.primary }}>
              Guardar cambios
            </Button>
          </div>
        </Form>
      </Modal>
    </PageLayout>
  );
}
