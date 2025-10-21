import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import TextField from '../inputs/TextField';

/**
 * TableComponent - Componente de tabla reutilizable con Bootstrap 5 + paginación
 * @param {Array} headers - Array de objetos { key, label, align? }
 * @param {Array} data - Array de objetos (filas)
 * @param {Array} actions - Array de acciones opcionales [{ label, icon, onClick, variant, iconType }]
 * @param {number} pageSize - Tamaño de página (opcional, default 10)
 */

const ICONS = {
    editar: <i className="bi bi-pencil" aria-hidden="true"></i>,
    eliminar: <i className="bi bi-trash" aria-hidden="true"></i>,
    ver: <i className="bi bi-eye" aria-hidden="true"></i>,
    pdf: <i className="bi bi-file-earmark-pdf" aria-hidden="true"></i>,
    tarifas: <i className="bi bi-cash-coin" aria-hidden="true"></i>,
};

const ActionButton = React.memo(({ action, row }) => (
    <button
        type="button"
        className={`btn btn-sm btn-${(action.iconType === 'tarifas' || action.iconType === 'editar') ? 'primary' : (action.variant || "outline-primary")} rounded-circle d-flex align-items-center justify-content-center`}
        title={action.label}
        aria-label={action.label}
        style={{ width: 32, height: 32 }}
        onClick={() => action.onClick(row)}
    >
        {action.iconType && ICONS[action.iconType]
            ? React.cloneElement(ICONS[action.iconType], { 'aria-hidden': true })
            : action.icon || action.label}
    </button>
));

function getPagination(current, total) {
    // Muestra máximo 5 páginas, con ... si es necesario
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        if (current > 3) pages.push(1);
        if (current > 4) pages.push('...');
        for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) pages.push(i);
        if (current < total - 3) pages.push('...');
        if (current < total - 2) pages.push(total);
    }
    return pages;
}

const TableComponent = ({ headers = [], data = [], actions = [], pageSize = 10, searchKey, renderCell }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const searchTimeout = useRef();

    // Debounce para el buscador 
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => setDebouncedSearch(search), 1000); // 1000 ms
        return () => clearTimeout(searchTimeout.current);
    }, [search]);

    // Scroll al cambiar de página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    // Filtrado flexible
    const filteredData = useMemo(() => {
        if (!debouncedSearch) return data;

        const lowerSearch = debouncedSearch.toLowerCase();

        if (searchKey) {
            return data.filter(row =>
                (row[searchKey] || "").toString().toLowerCase().includes(lowerSearch)
            );
        }

        return data.filter(row =>
            headers.some(header =>
                (row[header.key] || '').toString().toLowerCase().includes(lowerSearch)
            )
        );
    }, [data, debouncedSearch, searchKey, headers]);

    const totalPages = useMemo(() => Math.ceil(filteredData.length / pageSize) || 1, [filteredData, pageSize]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, page, pageSize]);

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
            setPage(newPage);
        }
    }, [page, totalPages]);

    // Reset page si cambia el filtro
    useEffect(() => { setPage(1); }, [debouncedSearch]);

    return (
        <div className="table-responsive">
            {/* Buscador */}
            <div className="mb-2 d-flex justify-content-end pe-4">
                <div style={{ minWidth: 220, maxWidth: 260 }}>
                    <TextField
                        id="table-search"
                        label={null}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={`Buscar...`}
                        className="form-control form-control-lg px-4 py-2"
                        autoComplete="off"
                        style={{ fontSize: 18, height: 48 }}
                    />
                </div>
            </div>

            <table className="table table-hover align-middle mb-0 bg-white border rounded-4 shadow-sm overflow-hidden">
                <thead className="table-light">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header.key}
                                className={header.align ? `text-${header.align}` : "text-start"}
                                scope="col"
                                style={{ whiteSpace: "nowrap", fontWeight: 600, letterSpacing: 0.5 }}
                            >
                                {header.label}
                            </th>
                        ))}
                        {actions.length > 0 && <th className="text-center" scope="col">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length + (actions.length > 0 ? 1 : 0)} className="text-center text-muted py-4">
                                No hay datos para mostrar
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((row, idx) => (
                            <tr key={row.id || idx} className="border-bottom">
                                {headers.map((header) => (
                                    <td
                                        key={header.key}
                                        className={`${header.align ? `text-${header.align}` : 'text-start'} align-middle`}
                                    >
                                        {header.render?.(row) ?? renderCell?.(row, header) ?? row[header.key]}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="text-center" style={{ minWidth: 120 }}>
                                        <div className="d-flex justify-content-center gap-2">
                                            {actions.map((action, i) => (
                                                <ActionButton key={i} action={action} row={row} />
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
                <nav className="d-flex justify-content-end mt-3">
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                            <button className="page-link" aria-label="Anterior" onClick={() => handlePageChange(page - 1)}>&laquo;</button>
                        </li>
                        {getPagination(page, totalPages).map((p, i) =>
                            p === '...'
                                ? <li key={i} className="page-item disabled"><span className="page-link">...</span></li>
                                : <li key={i} className={`page-item${page === p ? " active" : ""}`}>
                                    <button className="page-link" aria-label={`Ir a página ${p}`} onClick={() => handlePageChange(p)}>{p}</button>
                                </li>
                        )}
                        <li className={`page-item${page === totalPages ? " disabled" : ""}`}>
                            <button className="page-link" aria-label="Siguiente" onClick={() => handlePageChange(page + 1)}>&raquo;</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default TableComponent;
